import Toast from "react-native-toast-message";

export const showSuccessToast = (message:string) => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message || "Succeeded!",
    visibilityTime: 2800,
    autoHide: true,
  });
};

export const showErrorToast = (message:string) => {
  Toast.show({
    type: "error",
    text1: "Error",
    text2: message || "Something went wrong!",
    visibilityTime: 2800,
    autoHide: true,
  });
};

export const showInfoToast = (message:string) => {
  Toast.show({
    type: "info",
    text1: "Note",
    text2: message || "Here is some information.",
    visibilityTime: 2800,
    autoHide: true,
  });
};
