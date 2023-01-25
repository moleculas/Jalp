import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';

function FilaMod6(props) {
    const { producto, registrarFila, borrarFila, index } = props;
    const [valoresProducto, setValoresProducto] = useState(null);
    const [disabledGrabar, setDisabledGrabar] = useState(true);
    const [disabledModificado, setDisabledModificado] = useState(true);

    //useEffect 

    useEffect(() => {
        if (producto) {
            setValoresProducto({
                _id: producto._id,
                descripcion: producto.descripcion,
                sage: producto.sage,
                codigo: producto.codigo,
                historico: producto.historico,
                activo: producto.activo
            });
        };
    }, [producto]);

    useEffect(() => {
        if (
            valoresProducto &&
            valoresProducto.descripcion &&
            valoresProducto.sage &&
            valoresProducto.codigo
        ) {
            setDisabledGrabar(false);
        } else {
            setDisabledGrabar(true);
            setDisabledModificado(true);
        };
    }, [valoresProducto]);

    //funciones  

    const handleChange = (event, tipo) => {
        let valor = event.target.value;    
        tipo === "codigo" && (valor = _.deburr(event.target.value).replaceAll(" ", "-").toLowerCase());  
        setValoresProducto({ ...valoresProducto, [tipo]: valor });
        producto._id && (setDisabledModificado(false));
    };

    const handleChangeToggle = (valor) => {
        setValoresProducto({ ...valoresProducto, activo: valor });
        producto._id && (setDisabledModificado(false));
    };

    if (!valoresProducto) {
        return null
    };

    return (
        valoresProducto && (
            <Box className="flex flex-col md:flex-row items-center w-full space-x-0 sm:space-x-8 space-y-16 sm:space-y-0 mb-20">
                <TextField
                    label="Descripción"
                    value={valoresProducto.descripcion}
                    onChange={(event) => handleChange(event, 'descripcion')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[75%]"
                />
                <TextField
                    label="SAGE"
                    value={valoresProducto.sage}
                    onChange={(event) => handleChange(event, 'sage')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[50%]"
                />
                <TextField
                    label="Código interno"
                    value={valoresProducto.codigo || ""}
                    onChange={(event) => handleChange(event, 'codigo')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[50%]"                    
                />
                <div className="flex items-center">
                    <Tooltip
                        arrow
                        placement="top-start"
                        title={valoresProducto.activo ? "Activo" : "No activo"}
                    >
                        <ToggleButton
                            className="mr-8"
                            value="check"
                            selected={!valoresProducto.activo}
                            onChange={() => {
                                handleChangeToggle(!valoresProducto.activo)
                            }}
                        >
                            <FuseSvgIcon>{valoresProducto.activo ? "heroicons-outline:check" : "heroicons-outline:x"}</FuseSvgIcon>
                        </ToggleButton>
                    </Tooltip>
                    <Tooltip arrow placement="top-start" title={(disabledGrabar || disabledModificado) ? "" : (producto._id ? "Actualizar datos" : "Registrar datos")}>
                        <IconButton
                            onClick={() => { registrarFila(valoresProducto); setDisabledModificado(true) }}
                            disabled={producto._id ? disabledModificado : disabledGrabar}
                        >
                            <FuseSvgIcon>{producto._id ? "heroicons-outline:pencil-alt" : "material-outline:save"}</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="top-start" title="Borrar fila">
                        <IconButton
                            onClick={() => borrarFila(producto._id, index)}
                            color="error"
                        >
                            <FuseSvgIcon>material-outline:delete</FuseSvgIcon>
                        </IconButton>
                    </Tooltip>
                </div>
            </Box>
        )
    )
}

export default FilaMod6;
