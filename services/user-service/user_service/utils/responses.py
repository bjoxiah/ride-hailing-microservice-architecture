from fastapi.encoders import jsonable_encoder

def success(data=None):
    return {
        "success": True,
        "data": jsonable_encoder(data) if data is not None else {}
    }
