import React, { useState } from 'react'
import { API_URL } from '../api/config';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    let navigate = useNavigate();

    const [user, setUser] = useState({
        name:"",
        lastname:"",
        email:"",
        password:""
    })

    const{name, lastname, email, password} = user;

    const onInputChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${API_URL}/user`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
    
            if (response.ok) {
                alert("Usuario registrado correctamente");
                navigate("/login");
            } else {
                const result = await response.json();
                alert(result.message || "Error al registrar");
            }
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Error de conexión");
        }
    };

    return (
        <div className='container'>
            <div className='container text-center' style={{margin: "30px"}}>
                <h4>Registrar Cuenta</h4>
            </div>
            <form onSubmit={(e) => handleSubmit(e)} autoComplete='off'>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Nombre</label>
                    <input 
                        type="text" className="form-control" 
                        id="name" name='name'
                        value={name}
                        onChange={(e)=>onInputChange(e)}
                        required={true}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="lastname" className="form-label">Apellido</label>
                    <input 
                        type="text" className="form-control"
                        id="lastname" name='lastname'
                        value={lastname}
                        onChange={(e)=>onInputChange(e)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Correo</label>
                    <input 
                        type="email" className="form-control"
                        id="email" name='email'
                        value={email}
                        onChange={(e)=>onInputChange(e)}
                        required={true}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input 
                        type="password" className="form-control" 
                        id="password" name='password'
                        value={password}
                        onChange={(e)=>onInputChange(e)}
                        required={true}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Registrarse</button>
            </form>
        </div>
    )
}
