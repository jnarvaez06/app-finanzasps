import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL_LOGIN } from '../api/config';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    let navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();
        
    const handleLogin = async (e) => {
        e.preventDefault();

        const dataLogin = {username:email, password:password};
        
        try {
            const response = await fetch(`${API_URL_LOGIN}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataLogin),
            });

            let result = null;
            try {
                result = await response.json(); // intenta leer el JSON
            } catch (err) {
                console.warn("La respuesta no contenía JSON válido");
            }
    
            if (response.ok) {
                if (result?.token) {
                    login(result.token);
                    // console.log(result.token)
                }
                navigate("/dashboard");
            } else {
                alert(result?.message || "Error al iniciar sesión");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Error de conexión");
        }
    }

  return (
    <div className='container'>
        <form autoComplete='off'>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Correo</label>
                <input type="email" 
                    className="form-control" 
                    id="email" name='email'
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Contraseña</label>
                <input 
                    type="password" className="form-control"
                    id="password" name='password'
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="mb-3 text-center">
                <button type="submit" className="btn btn-primary me-3" onClick={handleLogin}>Ingresar</button>
                <Link to={`/register`} className='btn btn-primary'>Registrarse</Link>
            </div>
        </form>
    </div>
  )
}
