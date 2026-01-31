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


class Pzem(Base):
    __tablename__ = "pzems"

    id = Column(Text, unique=True, primary_key=True)
    device_id = Column(Integer)

    voltage = Column(Double)
    current = Column(Double)
    power = Column(Double)
    energy = Column(Double)

    timestamp = Column(BigInteger)


class PzemModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str

    device_id: int

    voltage: float
    current: float
    power: float
    energy: float

    timestamp: int


####################
# Forms
####################


class PzemResponse(BaseModel):
    id: str
    device_id: int
    voltage: float
    current: float
    power: float
    energy: float
    timestamp: int  # timestamp in epoch


class PzemForm(BaseModel):
    device_id: int
    voltage: float
    current: float
    power: float
    energy: float
    timestamp: int


class PzemUpdateForm(PzemForm):
    device_id: Optional[int] = None
    voltage: Optional[float] = None
    current: Optional[float] = None
    power: Optional[float] = None
    energy: Optional[float] = None
    timestamp: Optional[int] = None


class PzemTable:
    def insert_new_pzem(self, form_data: PzemForm):
        with get_db() as db:
            pzem = PzemModel(
                **{
                    **form_data.model_dump(exclude_none=True),
                    "id": str(uuid.uuid4()),
                }
            )

            try:
                result = Pzem(**pzem.model_dump())
                db.add(result)
                db.commit()
                db.refresh(result)
                if result:
                    return PzemModel.model_validate(result)
                else:
                    return None

            except Exception:
                return None

    def get_pzems(self):
        with get_db() as db:
            return [
                PzemModel.model_validate(pzem)
                for pzem in db.query(Pzem).order_by(Pzem.timestamp.desc()).all()
            ]

    def get_pzem_by_id(self, id: str) -> Optional[PzemModel]:
        try:
            with get_db() as db:
                pzem = db.query(Pzem).filter_by(id=id).first()
                return PzemModel.model_validate(pzem) if pzem else None
        except Exception:
            return None

    def get_pzem_by_device_id(self, device_id: int) -> Optional[list[PzemModel]]:
        try:
            with get_db() as db:
                pzems = db.query(Pzem).filter_by(device_id=device_id).all()
                return (
                    [PzemModel.model_validate(pzem) for pzem in pzems]
                    if pzems
                    else None
                )
        except Exception:
            return None

    def update_pzem_by_id(
        self, id: str, form_data: PzemUpdateForm, overwrite: bool = False
    ) -> Optional[PzemModel]:
        try:
            with get_db() as db:
                db.query(Pzem).filter_by(id=id).update(
                    {
                        **form_data.model_dump(exclude_none=True),
                    }
                )
                db.commit()
                return self.get_pzem_by_id(id=id)
        except Exception as e:
            log.exception(e)
            return None

    def delete_pzem_by_id(self, id: str) -> bool:
        try:
            with get_db() as db:
                db.query(Pzem).filter_by(id=id).delete()
                db.commit()
                return True
        except Exception:
            return False

    def delete_all_pzems(self) -> bool:
        with get_db() as db:
            try:
                db.query(Pzem).delete()
                db.commit()

                return True
            except Exception:
                return False


Pzems = PzemTable()
