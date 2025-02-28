import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputItem from "../../components/InputItem";
import Swal from "sweetalert2";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        id_role: 1
    });

    const [errors, setErrors] = useState({});
    const [passwordValidations, setPasswordValidations] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false,
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    // Validaciones en tiempo real
    const validateForm = () => {
        let newErrors = {};

        // Email válido
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "El correo electrónico no es válido.";
        }

        // Validación de contraseña
        if (!Object.values(passwordValidations).every(Boolean)) {
            newErrors.password = "La contraseña debe cumplir con todos los requisitos.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "name" || name === "last_name") {
            // Permitir solo letras y espacios
            if (/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]*$/.test(value)) {
                setFormData({ ...formData, [name]: value });
            }
        } else if (name === "password") {
            // Validar la contraseña en tiempo real
            const validations = {
                length: value.length >= 8,
                uppercase: /[A-Z]/.test(value),
                lowercase: /[a-z]/.test(value),
                number: /\d/.test(value),
                specialChar: /[@$!%*?&]/.test(value),
            };
            setPasswordValidations(validations);
            setFormData({ ...formData, password: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/users`, formData);
            console.log("Respuesta del backend:", res.data);

            Swal.fire({
                title: "TOKEN ENVIADO",
                text: "Revisa la bandeja de entrada de tu correo",
                icon: "success",
                confirmButtonText: "OK",
                allowOutsideClick: false
            });

            setFormData({ name: "", last_name: "", email: "", password: "", id_role: 1 });
            navigate("/login");
        } catch (error) {
            console.error("Error en el registro:", error);
            Swal.fire({
                title: "Error",
                text: error.response?.data?.error || "Error al registrar usuario",
                icon: "error",
                confirmButtonText: "OK"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-[#d9e6f5]">
            <div className="w-[70%] bg-white flex shadow-lg rounded-md p-10">
                <div className="hidden lg:w-[50%] lg:flex flex-col items-center justify-center border-r border-gray-300">
                    <img
                        src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        className="lg:w-[80%] max-h-[500px] object-contain"
                        alt="Sample image"
                    />
                </div>
                <div className="w-full lg:w-[50%] flex flex-col items-center justify-center px-2">
                    <h1 className="text-4xl font-bold mb-5 text-center">REGISTRO DE USUARIO</h1>

                    <form className="flex flex-col w-full sm:w-[90%] items-center" onSubmit={handleSubmit}>
                        {/* Nombre */}
                        <InputItem
                            id="name" labelName="Nombre" placeholder="Nombre" type="text" name="name"
                            value={formData.name} onChange={handleChange} required
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                        {/* Apellido */}
                        <InputItem
                            id="last_name" labelName="Apellido" placeholder="Apellido" type="text" name="last_name"
                            value={formData.last_name} onChange={handleChange} required
                        />
                        {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name}</p>}

                        {/* Email */}
                        <InputItem
                            id="email" labelName="Correo Electrónico" placeholder="Correo electrónico" type="email" name="email"
                            value={formData.email} onChange={handleChange} required
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                        {/* Contraseña */}
                        <InputItem
                            id="password" labelName="Contraseña" placeholder="Contraseña" type="password" name="password"
                            value={formData.password} onChange={handleChange} required
                        />
                        <ul className="mt-2 text-sm">
                            <li className={passwordValidations.length ? "text-green-600" : "text-red-600"}>
                                {passwordValidations.length ? "✔" : "✖"} Mínimo 8 caracteres
                            </li>
                            <li className={passwordValidations.uppercase ? "text-green-600" : "text-red-600"}>
                                {passwordValidations.uppercase ? "✔" : "✖"} Al menos una letra mayúscula
                            </li>
                            <li className={passwordValidations.lowercase ? "text-green-600" : "text-red-600"}>
                                {passwordValidations.lowercase ? "✔" : "✖"} Al menos una letra minúscula
                            </li>
                            <li className={passwordValidations.number ? "text-green-600" : "text-red-600"}>
                                {passwordValidations.number ? "✔" : "✖"} Al menos un número
                            </li>
                            <li className={passwordValidations.specialChar ? "text-green-600" : "text-red-600"}>
                                {passwordValidations.specialChar ? "✔" : "✖"} Al menos un carácter especial (@$!%*?&)
                            </li>
                        </ul>

                        <button
                            type="submit"
                            className={`w-[80%] sm:w-[45%] mt-4 bg-[#365486] text-white py-2 px-2 rounded-lg 
                            ${loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#344663] hover:scale-105 transition-all duration-300 ease-in-out"}`}
                            disabled={loading}
                        >
                            {loading ? "Registrando..." : "Registrar"}
                        </button>
                    </form>

                    <div className="flex-row sm:flex text-center mt-2 gap-2">
                        <p>¿Ya tienes cuenta?</p>
                        <a href="/login" className="font-semibold text-md hover:underline text-[#8d9bd6]">Inicia Sesión</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;