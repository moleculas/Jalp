import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

function FilaMod7(props) {
    const { producto, registrarFila, borrarFila, index } = props;
    const [valoresProducto, setValoresProducto] = useState(null);
    const [disabledGrabar, setDisabledGrabar] = useState(true);
    const [disabledModificado, setDisabledModificado] = useState(true);

    //useEffect 

    useEffect(() => {
        if (producto) {
            setValoresProducto({
                _id: producto._id,
                destino: producto.destino,
                vehiculo: producto.vehiculo,
                unidadesVehiculo: producto.unidadesVehiculo,
                precioUnitario: producto.precioUnitario,
                historico: producto.historico,
                activo: producto.activo
            });
        };
    }, [producto]);

    useEffect(() => {
        if (
            valoresProducto &&
            valoresProducto.destino &&
            valoresProducto.vehiculo &&
            valoresProducto.unidadesVehiculo &&
            valoresProducto.precioUnitario
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
        (tipo === "precioUnitario" || tipo === "unidadesVehiculo") && (valor = Number(event.target.value));
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
                    label="Destino"
                    value={valoresProducto.destino}
                    onChange={(event) => handleChange(event, 'destino')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[50%]"
                />
                <FormControl variant="outlined" className="w-full md:w-[50%] xl:w-[25%]">
                    <InputLabel>Vehículo</InputLabel>
                    <Select
                        label="Vehículo"
                        value={valoresProducto.vehiculo}
                        onChange={(event) => handleChange(event, 'vehiculo')}
                    >
                        <MenuItem value="">
                            <em>Vehículo</em>
                        </MenuItem>
                        <MenuItem value={'camion'}>Camión</MenuItem>
                        <MenuItem value={'trailer'}>Tráiler</MenuItem>
                        <MenuItem value={'trenCarretera'}>Tren de carretera</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Unidades/vehículo"
                    value={valoresProducto.unidadesVehiculo || ""}
                    onChange={(event) => handleChange(event, 'unidadesVehiculo')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[25%]"
                    type="number"
                />
                <TextField
                    label="Precio"
                    value={valoresProducto.precioUnitario || ""}
                    onChange={(event) => handleChange(event, 'precioUnitario')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[25%]"
                    type="number"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                    }}
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

export default FilaMod7;
