import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api/authApi";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<{
    userName: string;
    email: string;
    password: string;
    profilePicture: File | null;
  }>({
    userName: "",
    email: "",
    password: "",
    profilePicture: null,
  });

  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        const response = await login({
          email: formData.email,
          password: formData.password,
        });
        console.log("Login erfolgreich:", response);
      } else {
        console.log("Formular zu sendende Daten:", formData);

        const formDataToSend = new FormData();
        formDataToSend.append("userName", formData.userName);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        if (formData.profilePicture) {
          console.log("profilbild", formData.profilePicture.name);
          formDataToSend.append("profilePicture", formData.profilePicture);
        }

        const response = await register(formDataToSend);
        console.log("Registrierung erfolgreich:", response);

        //Automatische Anmeldung nach der Registrierung des Benutzers
        const loginResponse = await login({
          email: formData.email,
          password: formData.password,
        });
        console.log("Automatischer Login erfolgreich: ", loginResponse);
      }

      navigate("/home");
    } catch (err) {
      console.error("Fehler bei der Registrierung:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Ein unbekannter Fehler ist aufgetreten"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10 order-2 md:order-1">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            {isLogin ? "Ihre Einkaufsliste" : "Konto erstellen"}
          </h2>
          <p className="text-center text-gray-500 mt-2">
            Einfach mit Ihrem Konto anmelden
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Benutzername"
                  value={formData.userName}
                  onChange={(e) =>
                    setFormData({ ...formData, userName: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              )}
              <input
                type="email"
                placeholder="E-Mail-Adresse"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Passwort"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-600"
                  aria-label={
                    showPassword ? "Passwort verbergen" : "Passwort anzeigen"
                  }
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
              {!isLogin && (
                <div className="w-full">
                  <label
                    htmlFor="fileUpload"
                    className="block w-full cursor-pointer p-3 text-center border border-gray-300 rounded-lg bg-gray-50 text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    {formData.profilePicture
                      ? `Profile photo: ${formData.profilePicture.name}`
                      : "Upload a profile photo"}
                  </label>
                  <input
                    id="fileUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="Profilbild hochladen"
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-700 hover:bg-gray-800 text-white font-medium py-3 rounded-lg transition-all"
              aria-label={
                isLogin ? "Mit meiner E-Mail fortfahren" : "Registrieren"
              }
            >
              {isLogin ? "Mit meiner E-Mail fortfahren" : "Registrieren"}
            </button>
          </form>

          <div className="text-center mt-4">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-600 hover:underline text-sm"
              aria-label={isLogin ? "Hier registrieren" : "Hier anmelden"}
            >
              {isLogin
                ? "Sie haben noch kein Konto? Hier registrieren"
                : "Bereits ein Konto? Hier anmelden"}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-screen flex justify-center md:justify-end order-2 md:order-2">
        <img
          src="/images/myhome.jpg"
          alt="Einkaufsillustration"
          className="w-full h-48 md:h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Auth;
