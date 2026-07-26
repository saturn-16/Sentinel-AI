from fastapi import APIRouter
from backend.api.v1.auth import router as auth_router
from backend.api.v1.users import router as users_router
from backend.api.v1.devices import router as devices_router
from backend.api.v1.profiles import router as profiles_router
from backend.api.v1.auth_logs import router as auth_logs_router
from backend.api.v1.activity_logs import router as activity_logs_router
from backend.api.v1.alerts import router as alerts_router
from backend.api.v1.incidents import router as incidents_router
from backend.api.v1.analytics import router as analytics_router
from backend.api.v1.generator import router as generator_router
from backend.api.v1.predictions import router as predictions_router
from backend.api.v1.risk_scores import router as risk_scores_router
from backend.api.v1.ws import router as ws_router

api_v1_router = APIRouter()
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(devices_router)
api_v1_router.include_router(profiles_router)
api_v1_router.include_router(auth_logs_router)
api_v1_router.include_router(activity_logs_router)
api_v1_router.include_router(alerts_router)
api_v1_router.include_router(incidents_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(generator_router)
api_v1_router.include_router(predictions_router)
api_v1_router.include_router(risk_scores_router)
api_v1_router.include_router(ws_router)
