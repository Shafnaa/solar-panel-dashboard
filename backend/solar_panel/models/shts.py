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


class Sht(Base):
    __tablename__ = "shts"

    id = Column(Text, unique=True, primary_key=True)
    device_id = Column(Integer)

    temperature = Column(Double)
    humidity = Column(Double)

    timestamp = Column(BigInteger)


class ShtModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str

    device_id: int

    temperature: float
    humidity: float

    timestamp: int


####################
# Forms
####################


class ShtResponse(BaseModel):
    id: str
    device_id: int
    temperature: float
    humidity: float
    timestamp: int  # timestamp in epoch


class ShtForm(BaseModel):
    device_id: int
    temperature: float
    humidity: float
    timestamp: int


class ShtUpdateForm(ShtForm):
    device_id: Optional[int] = None
    temperature: Optional[float] = None
    humidity: Optional[float] = None
    timestamp: Optional[int] = None


class ShtTable:
    def insert_new_sht(self, form_data: ShtForm):
        with get_db() as db:
            sht = ShtModel(
                **{
                    **form_data.model_dump(exclude_none=True),
                    "id": str(uuid.uuid4()),
                }
            )

            try:
                result = Sht(**sht.model_dump())
                db.add(result)
                db.commit()
                db.refresh(result)
                if result:
                    return ShtModel.model_validate(result)
                else:
                    return None

            except Exception:
                return None

    def get_shts(self):
        with get_db() as db:
            return [
                ShtModel.model_validate(sht)
                for sht in db.query(Sht).order_by(Sht.timestamp.desc()).all()
            ]

    def get_sht_by_id(self, id: str) -> Optional[ShtModel]:
        try:
            with get_db() as db:
                sht = db.query(Sht).filter_by(id=id).first()
                return ShtModel.model_validate(sht) if sht else None
        except Exception:
            return None

    def get_sht_by_device_id(self, device_id: int) -> Optional[list[ShtModel]]:
        try:
            with get_db() as db:
                shts = db.query(Sht).filter_by(device_id=device_id).all()
                return [ShtModel.model_validate(sht) for sht in shts] if shts else None
        except Exception:
            return None

    def update_sht_by_id(
        self, id: str, form_data: ShtUpdateForm, overwrite: bool = False
    ) -> Optional[ShtModel]:
        try:
            with get_db() as db:
                db.query(Sht).filter_by(id=id).update(
                    {
                        **form_data.model_dump(exclude_none=True),
                    }
                )
                db.commit()
                return self.get_sht_by_id(id=id)
        except Exception as e:
            log.exception(e)
            return None

    def delete_sht_by_id(self, id: str) -> bool:
        try:
            with get_db() as db:
                db.query(Sht).filter_by(id=id).delete()
                db.commit()
                return True
        except Exception:
            return False

    def delete_all_shts(self) -> bool:
        with get_db() as db:
            try:
                db.query(Sht).delete()
                db.commit()

                return True
            except Exception:
                return False


Shts = ShtTable()
