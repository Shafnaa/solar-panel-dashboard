import logging
import time
import uuid

from solar_panel.env import SRC_LOG_LEVELS
from solar_panel.internal.db import Base, get_db

from typing import Optional
from pydantic import BaseModel, ConfigDict
from sqlalchemy import BigInteger, Column, Double, Integer, Text


log = logging.getLogger(__name__)
log.setLevel(SRC_LOG_LEVELS["MODELS"])


class Ddsu(Base):
    __tablename__ = "ddsus"

    id = Column(Text, unique=True, primary_key=True)
    device_id = Column(Integer)

    voltage = Column(Double)
    current = Column(Double)
    power = Column(Double)
    frequency = Column(Double)
    power_factor = Column(Double)
    energy = Column(Double)

    timestamp = Column(BigInteger)


class DdsuModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str

    device_id: int

    voltage: float
    current: float
    power: float
    frequency: float
    power_factor: float
    energy: float

    timestamp: int


####################
# Forms
####################


class DdsuResponse(BaseModel):
    id: str
    device_id: int
    voltage: float
    current: float
    power: float
    frequency: float
    power_factor: float
    energy: float
    timestamp: int  # timestamp in epoch


class DdsuForm(BaseModel):
    device_id: int
    voltage: float
    current: float
    power: float
    frequency: float
    power_factor: float
    energy: float
    timestamp: int


class DdsuUpdateForm(DdsuForm):
    device_id: Optional[int] = None
    voltage: Optional[float] = None
    current: Optional[float] = None
    power: Optional[float] = None
    frequency: Optional[float] = None
    power_factor: Optional[float] = None
    energy: Optional[float] = None
    timestamp: Optional[int] = None


class DdsuTable:
    def insert_new_ddsu(self, form_data: DdsuForm):
        with get_db() as db:
            ddsu = DdsuModel(
                **{
                    **form_data.model_dump(exclude_none=True),
                    "id": str(uuid.uuid4()),
                }
            )

            try:
                result = Ddsu(**ddsu.model_dump())
                db.add(result)
                db.commit()
                db.refresh(result)
                if result:
                    return DdsuModel.model_validate(result)
                else:
                    return None

            except Exception:
                return None

    def get_ddsus(self):
        with get_db() as db:
            return [
                DdsuModel.model_validate(ddsu)
                for ddsu in db.query(Ddsu).order_by(Ddsu.timestamp.desc()).all()
            ]

    def get_ddsu_by_id(self, id: str) -> Optional[DdsuModel]:
        try:
            with get_db() as db:
                ddsu = db.query(Ddsu).filter_by(id=id).first()
                return DdsuModel.model_validate(ddsu) if ddsu else None
        except Exception:
            return None

    def get_ddsu_by_device_id(self, device_id: str) -> Optional[list[DdsuModel]]:
        try:
            with get_db() as db:
                ddsus = db.query(Ddsu).filter_by(device_id=device_id).all()
                return (
                    [DdsuModel.model_validate(ddsu) for ddsu in ddsus]
                    if ddsus
                    else None
                )
        except Exception:
            return None

    def update_ddsu_by_id(
        self, id: str, form_data: DdsuUpdateForm, overwrite: bool = False
    ) -> Optional[DdsuModel]:
        try:
            with get_db() as db:
                db.query(Ddsu).filter_by(id=id).update(
                    {
                        **form_data.model_dump(exclude_none=True),
                    }
                )
                db.commit()
                return self.get_ddsu_by_id(id=id)
        except Exception as e:
            log.exception(e)
            return None

    def delete_ddsu_by_id(self, id: str) -> bool:
        try:
            with get_db() as db:
                db.query(Ddsu).filter_by(id=id).delete()
                db.commit()
                return True
        except Exception:
            return False

    def delete_all_ddsus(self) -> bool:
        with get_db() as db:
            try:
                db.query(Ddsu).delete()
                db.commit()

                return True
            except Exception:
                return False


Ddsus = DdsuTable()
