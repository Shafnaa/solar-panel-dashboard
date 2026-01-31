import logging
import time
import uuid

from solar_panel.env import SRC_LOG_LEVELS
from solar_panel.internal.db import Base, get_db

from typing import Optional
from pydantic import BaseModel, ConfigDict
from sqlalchemy import BigInteger, Column, Text, Integer


log = logging.getLogger(__name__)
log.setLevel(SRC_LOG_LEVELS["MODELS"])


class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, unique=True, primary_key=True)

    name = Column(Text)
    description = Column(Text)

    created_at = Column(BigInteger)


class DeviceModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int

    name: str
    description: str

    created_at: int


####################
# Forms
####################


class DeviceResponse(BaseModel):
    id: int
    name: str
    description: str
    created_at: int  # timestamp in epoch


class DeviceForm(BaseModel):
    id: int
    name: str
    description: str


class DeviceUpdateForm(DeviceForm):
    id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None


class DeviceTable:
    def insert_new_device(self, form_data: DeviceForm):
        with get_db() as db:
            device = DeviceModel(
                **{
                    **form_data.model_dump(exclude_none=True),
                    "created_at": int(time.time()),
                }
            )

            try:
                result = Device(**device.model_dump())
                db.add(result)
                db.commit()
                db.refresh(result)
                if result:
                    return DeviceModel.model_validate(result)
                else:
                    return None

            except Exception:
                return None

    def get_devices(self):
        with get_db() as db:
            return [
                DeviceModel.model_validate(device)
                for device in db.query(Device).order_by(Device.created_at.desc()).all()
            ]

    def get_device_by_id(self, id: int) -> Optional[DeviceModel]:
        try:
            with get_db() as db:
                device = db.query(Device).filter_by(id=id).first()
                return DeviceModel.model_validate(device) if device else None
        except Exception:
            return None

    def update_device_by_id(
        self, id: int, form_data: DeviceUpdateForm, overwrite: bool = False
    ) -> Optional[DeviceModel]:
        try:
            with get_db() as db:
                db.query(Device).filter_by(id=id).update(
                    {
                        **form_data.model_dump(exclude_none=True),
                    }
                )
                db.commit()
                return self.get_device_by_id(id=id)
        except Exception as e:
            log.exception(e)
            return None

    def delete_device_by_id(self, id: int) -> bool:
        try:
            with get_db() as db:
                db.query(Device).filter_by(id=id).delete()
                db.commit()
                return True
        except Exception:
            return False

    def delete_all_devices(self) -> bool:
        with get_db() as db:
            try:
                db.query(Device).delete()
                db.commit()

                return True
            except Exception:
                return False


Devices = DeviceTable()
