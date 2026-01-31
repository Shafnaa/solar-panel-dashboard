from typing import Optional
import logging

from solar_panel.models.ddsus import (
    Ddsus,
    DdsuForm,
    DdsuUpdateForm,
    DdsuResponse,
)

from solar_panel.constants import ERROR_MESSAGES
from fastapi import APIRouter, HTTPException, status

from solar_panel.env import SRC_LOG_LEVELS


log = logging.getLogger(__name__)
log.setLevel(SRC_LOG_LEVELS["MAIN"])

router = APIRouter()

############################
# GetFunctions
############################


@router.get("/", response_model=list[DdsuResponse])
async def get_ddsus():
    return Ddsus.get_ddsus()


############################
# CreateNewDdsu
############################


@router.post("/create", response_model=Optional[DdsuResponse])
async def create_new_ddsu(form_data: DdsuForm):
    try:
        ddsu = Ddsus.insert_new_ddsu(form_data)
        if ddsu:
            return ddsu
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error creating ddsu"),
            )
    except Exception as e:
        log.exception(f"Error creating a new ddsu: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# GetDdsuById
############################


@router.get("/id/{id}", response_model=Optional[DdsuResponse])
async def get_ddsu_by_id(id: str):
    ddsu = Ddsus.get_ddsu_by_id(id)
    if ddsu:
        return ddsu
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ERROR_MESSAGES.NOT_FOUND,
        )


############################
# GetDdsuByDeviceId
############################


@router.get("/device/id/{device_id}", response_model=list[DdsuResponse])
async def get_ddsu_by_device_id(device_id: int):
    ddsus = Ddsus.get_ddsu_by_device_id(device_id)
    if ddsus is not None:
        return ddsus
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ERROR_MESSAGES.NOT_FOUND,
        )


############################
# UpdateDdsuById
############################


@router.post("/id/{id}/update", response_model=Optional[DdsuResponse])
async def update_ddsu_by_id(id: str, form_data: DdsuUpdateForm):
    try:
        ddsu = Ddsus.update_ddsu_by_id(id, form_data)
        if ddsu:
            return ddsu
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error updating ddsu"),
            )
    except Exception as e:
        log.exception(f"Error updating ddsu {id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# DeleteDdsuById
############################


@router.delete("/id/{id}/delete", response_model=bool)
async def delete_ddsu_by_id(id: str):
    try:
        result = Ddsus.delete_ddsu_by_id(id)
        if result:
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error deleting ddsu"),
            )
    except Exception as e:
        log.exception(f"Error deleting ddsu {id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )
