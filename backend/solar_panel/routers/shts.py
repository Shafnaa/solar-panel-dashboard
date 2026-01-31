from typing import Optional
import logging

from solar_panel.models.shts import (
    Shts,
    ShtForm,
    ShtUpdateForm,
    ShtResponse,
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


@router.get("/", response_model=list[ShtResponse])
async def get_shts():
    return Shts.get_shts()


############################
# CreateNewSht
############################


@router.post("/create", response_model=Optional[ShtResponse])
async def create_new_sht(form_data: ShtForm):
    try:
        sht = Shts.insert_new_sht(form_data)
        if sht:
            return sht
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error creating sht"),
            )
    except Exception as e:
        log.exception(f"Error creating a new sht: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# GetShtsById
############################


@router.get("/id/{id}", response_model=Optional[ShtResponse])
async def get_sht_by_id(id: str):
    sht = Shts.get_sht_by_id(id)
    if sht:
        return sht
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ERROR_MESSAGES.NOT_FOUND,
        )


############################
# UpdateShtById
############################


@router.post("/id/{id}/update", response_model=Optional[ShtResponse])
async def update_sht_by_id(id: str, form_data: ShtUpdateForm):
    try:
        sht = Shts.update_sht_by_id(id, form_data)
        if sht:
            return sht
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error updating sht"),
            )
    except Exception as e:
        log.exception(f"Error updating sht {id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# DeleteShtById
############################


@router.delete("/id/{id}/delete", response_model=bool)
async def delete_sht_by_id(id: str):
    try:
        result = Shts.delete_sht_by_id(id)
        if result:
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error deleting sht"),
            )
    except Exception as e:
        log.exception(f"Error deleting sht {id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )
