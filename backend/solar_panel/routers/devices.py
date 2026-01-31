from typing import Optional
import logging

from solar_panel.models.devices import (
    Devices,
    DeviceForm,
    DeviceUpdateForm,
    DeviceResponse,
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


@router.get("/", response_model=list[DeviceResponse])
async def get_devices():
    return Devices.get_devices()


############################
# CreateNewDevice
############################


@router.post("/create", response_model=Optional[DeviceResponse])
async def create_new_device(form_data: DeviceForm):
    try:
        device = Devices.insert_new_device(form_data)
        if device:
            return device
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error creating device"),
            )
    except Exception as e:
        log.exception(f"Error creating a new device: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# GetDeviceById
############################


@router.get("/id/{id}", response_model=Optional[DeviceResponse])
async def get_device_by_id(id: int):
    device = Devices.get_device_by_id(id)
    if device:
        return device
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ERROR_MESSAGES.NOT_FOUND,
        )


############################
# UpdateDeviceById
############################


@router.post("/id/{id}/update", response_model=Optional[DeviceResponse])
async def update_device_by_id(id: int, form_data: DeviceUpdateForm):
    try:
        device = Devices.update_device_by_id(id, form_data)
        if device:
            return device
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error updating device"),
            )
    except Exception as e:
        log.exception(f"Error updating device {id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )


############################
# DeleteDeviceById
############################


@router.delete("/id/{id}/delete", response_model=bool)
async def delete_device_by_id(id: int):
    try:
        result = Devices.delete_device_by_id(id)
        if result:
            return result
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=ERROR_MESSAGES.DEFAULT("Error deleting device"),
            )
    except Exception as e:
        log.exception(f"Error deleting device {id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_MESSAGES.DEFAULT(e),
        )
