import { logout } from "@features/auth/store/authSlice";
import type { AppDispatch } from "@app/store";

export const broadcast = new BroadcastChannel("auth");

let dispatch: AppDispatch | null = null;

export const initializeBroadcast = (storeDispatch: AppDispatch) => {
  dispatch = storeDispatch;
};

broadcast.onmessage = (event) => {
  if (event.data?.type === "LOGOUT" && dispatch) {
    dispatch(logout({ silent: true }));
  }
};
