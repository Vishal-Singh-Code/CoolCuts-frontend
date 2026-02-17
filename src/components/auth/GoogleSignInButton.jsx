import { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_ID = "google-identity-services";

const GoogleSignInButton = ({ onSuccess, onError, disabled = false }) => {
  const containerRef = useRef(null);
  const successRef = useRef(onSuccess);
  const errorRef = useRef(onError);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Keep callbacks stable
  useEffect(() => {
    successRef.current = onSuccess;
    errorRef.current = onError;
  }, [onSuccess, onError]);

  // Load script
  useEffect(() => {
    if (!clientId) return;

    const existing = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existing) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () =>
      errorRef.current?.("Unable to load Google Sign-In");

    document.head.appendChild(script);
  }, [clientId]);

  // Initialize Google button ONCE
  useEffect(() => {
    if (!clientId || !scriptLoaded || !containerRef.current || !window.google)
      return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => {
        if (disabled) return;

        if (response?.credential) {
          successRef.current?.(response.credential);
        } else {
          errorRef.current?.("Google login failed");
        }
      },
    });

    containerRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(containerRef.current, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 320,
    });
  }, [clientId, scriptLoaded, disabled]);

  if (!clientId) return null;

  return (
    <div className={disabled ? "opacity-60" : ""}>
      <div ref={containerRef} />
    </div>
  );
};

export default GoogleSignInButton;
