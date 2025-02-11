import * as React from "react";

export const NoScansMessage = () => {
  return (
    <div className="no-scans-message">
      <p>No scans available for this project.</p>
    </div>
  );
};

NoScansMessage.show = () => {
  const messageContainer = document.getElementById("noScansMessageContainer");
  if (messageContainer) {
    messageContainer.style.display = "block";
  }
};

NoScansMessage.hide = () => {
  const messageContainer = document.getElementById("noScansMessageContainer");
  if (messageContainer) {
    messageContainer.style.display = "none";
  }
};
