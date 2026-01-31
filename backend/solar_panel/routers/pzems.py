from typing import Optional
import logging

from solar_panel.models.pzems import (
    Pzems,
    PzemForm,
    PzemUpdateForm,
    PzemResponse,
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


@router.get("/", response_model=list[PzemResponse])
async def get_pzems():
    return Pzems.get_pzems()


############################
# CreateNewPzem
############################


@router.post("/create", response_model=Optional[PzemResponse])
async def create_new_pzem(form_data: PzemForm):
    try:
        pzem = Pzems.insert_new_pzem(form_data)
        if pzem:
            return pzem
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error creating pzem"),
            )
    except Exception as e:
        log.exception(f"Error creating a new pzem: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# GetPzemsById
############################


@router.get("/id/{id}", response_model=Optional[PzemResponse])
async def get_pzem_by_id(id: str):
    pzem = Pzems.get_pzem_by_id(id)
    if pzem:
        return pzem
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ERROR_MESSAGES.NOT_FOUND,
        )


############################
# GetPzemsById
############################


@router.get("/device/id/{device_id}", response_model=list[PzemResponse])
async def get_pzem_by_device_id(device_id: int):
    pzems = Pzems.get_pzem_by_device_id(device_id)
    if pzems is not None:
        return pzems
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ERROR_MESSAGES.NOT_FOUND,
        )


############################
# UpdatePzemById
############################


@router.post("/id/{id}/update", response_model=Optional[PzemResponse])
async def update_pzem_by_id(id: str, form_data: PzemUpdateForm):
    try:
        pzem = Pzems.update_pzem_by_id(id, form_data)
        if pzem:
            return pzem
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error updating pzem"),
            )
    except Exception as e:
        log.exception(f"Error updating pzem {id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# DeletePzemById
############################


@router.delete("/id/{id}/delete", response_model=bool)
async def delete_pzem_by_id(id: str):
    try:
        result = Pzems.delete_pzem_by_id(id)
        if result:
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error deleting pzem"),
            )
    except Exception as e:
        log.exception(f"Error deleting pzem {id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )
