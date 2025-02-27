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
        id_role: 1 // ⬅️ Si es fijo, lo mantenemos así.
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await axios.post(`${API_URL}/users`, formData);
            console.log("Respuesta del backend:", res.data);

            console.log("Estado HTTP:", res.status); // 👀 Verificar código de estado
            console.log("Respuesta completa:", res); // 👀 Revisar qué está devolviendo el backend
        

            navigate("/login");

            Swal.fire({
                title: "TOKEN ENVIADO",
                text: "Revisa la bandeja de entrada de tu correo",
                icon: "success",
                confirmButtonText: "OK",
                allowOutsideClick: false
            })
            setFormData({ name: "", last_name: "", email: "", password: "", id_role: 1 });
        } catch (error) {
            console.error("Error en el registro:", error);
            setError(error.response?.data?.error || "Error al registrar usuario");
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

                    {message && <p className="text-green-500 text-center">{message}</p>}
                    {error && <p className="text-red-500 text-center">{error}</p>}

                    <form className="flex flex-col w-full sm:w-[90%] items-center" onSubmit={handleSubmit}>
                        <InputItem id="name" labelName="Nombre" placeholder="Nombre" type="text" name="name" onChange={handleChange} required />
                        <InputItem id="last_name" labelName="Apellido" placeholder="Apellido" type="text" name="last_name" onChange={handleChange} required />
                        <InputItem id="email" labelName="Correo Electrónico" placeholder="Correo electrónico" type="email" name="email" onChange={handleChange} required />
                        <InputItem id="password" labelName="Contraseña" placeholder="Contraseña" type="password" name="password" onChange={handleChange} required />

                        <button
                            type="submit"
                            className={`w-[80%] sm:w-[45%] mt-4 bg-[#365486] text-white py-2 px-2 rounded-lg hover:bg-[#344663] hover:scale-105 transition-all duration-300 ease-in-out 
                        ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#365486] hover:bg-[#344663] hover:scale-105 transition-all duration-300 ease-in-out"}`}
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
