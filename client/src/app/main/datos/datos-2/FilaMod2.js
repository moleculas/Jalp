import { useState, useEffect } from 'react';
import { IconButton } from '@mui/material';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import ToggleButton from '@mui/material/ToggleButton';

//constantes
import { REDONDEADO } from 'constantes';

function FilaMod2(props) {
    const { producto, registrarFila, borrarFila, index } = props;
    const [valoresProducto, setValoresProducto] = useState(null);
    const [disabledGrabar, setDisabledGrabar] = useState(true);
    const [disabledModificado, setDisabledModificado] = useState(true);
    const [tipoClavo, setTipoClavo] = useState(null);

    //useEffect 

    useEffect(() => {
        if (producto) {
            setValoresProducto({
                _id: producto._id,
                descripcion: producto.descripcion,
                sage: producto.sage,
                categoria: producto.categoria,
                precioUnitario: producto.precioUnitario,
                historico: producto.historico,
                activo: producto.activo,
                especialClavos: producto.especialClavos
            });
            setTipoClavo(producto.categoria);
        };
    }, [producto]);

    useEffect(() => {
        if (
            valoresProducto &&
            valoresProducto.descripcion &&
            valoresProducto.sage &&
            valoresProducto.categoria &&
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
        if (tipo === "precioBobina" || tipo === "unidadesBobina" || tipo === "precioKg" || tipo === "unidadesKg") {
            let objetoEspecialClavos, precioBobina, unidadesBobina, precioKg, unidadesKg, precioUnitario;
            valor = Number(event.target.value);
            if (tipo === "precioBobina" || tipo === "unidadesBobina") {
                if (valoresProducto && valoresProducto.especialClavos) {
                    objetoEspecialClavos = {
                        ...valoresProducto.especialClavos
                    };
                    valoresProducto.especialClavos.precioBobina ? precioBobina = valoresProducto.especialClavos.precioBobina : 0;
                    valoresProducto.especialClavos.unidadesBobina ? unidadesBobina = valoresProducto.especialClavos.unidadesBobina : 0;
                } else {
                    objetoEspecialClavos = {
                        precioKg: null,
                        unidadesKg: null,
                    };
                    precioBobina = 0;
                    unidadesBobina = 0;
                };
                if (tipo === "precioBobina") {
                    objetoEspecialClavos.precioBobina = valor;
                    precioBobina = valor;
                    unidadesBobina ? (precioUnitario = precioBobina / unidadesBobina) : precioUnitario = 0;
                };
                if (tipo === "unidadesBobina") {
                    objetoEspecialClavos.unidadesBobina = valor;
                    unidadesBobina = valor;
                    precioUnitario = precioBobina / unidadesBobina;
                };
                setValoresProducto({
                    ...valoresProducto,
                    especialClavos: objetoEspecialClavos,
                    precioUnitario: _.round(precioUnitario, REDONDEADO)
                });
            };
            if (tipo === "precioKg" || tipo === "unidadesKg") {
                if (valoresProducto && valoresProducto.especialClavos) {
                    objetoEspecialClavos = {
                        ...valoresProducto.especialClavos
                    };
                    valoresProducto.especialClavos.precioKg ? precioKg = valoresProducto.especialClavos.precioKg : 0;
                    valoresProducto.especialClavos.unidadesKg ? unidadesKg = valoresProducto.especialClavos.unidadesKg : 0;
                } else {
                    objetoEspecialClavos = {
                        precioMillar: null
                    };
                    precioKg = 0;
                    unidadesKg = 0;
                };
                if (tipo === "precioKg") {
                    objetoEspecialClavos.precioKg = valor;
                    precioKg = valor;
                    unidadesKg ? (precioUnitario = precioKg / unidadesKg) : precioUnitario = 0;
                };
                if (tipo === "unidadesKg") {
                    objetoEspecialClavos.unidadesKg = valor;
                    unidadesKg = valor;
                    precioUnitario = precioKg / unidadesKg;
                };
                setValoresProducto({
                    ...valoresProducto,
                    especialClavos: objetoEspecialClavos,
                    precioUnitario: _.round(precioUnitario, REDONDEADO)
                });
            };
        } else {
            setValoresProducto({ ...valoresProducto, [tipo]: valor });
        };
        producto._id && (setDisabledModificado(false));
    };

    const handleChangeToggle = (valor) => {
        setValoresProducto({ ...valoresProducto, activo: valor });
        producto._id && (setDisabledModificado(false));
    };

    const retornaTitleTooltipGrabar = () => {
        if (producto._id) {
            if (!disabledModificado) {
                return "Actualizar datos"
            } else {
                return ""
            };
        } else {
            if (!disabledGrabar) {
                return "Registrar datos"
            } else {
                return ""
            };
        };
    };

    const retornaFormatoCasillas = () => {
        let valorCasillaPrecioBobina = "";
        let valorCasillaUnidadesBobina = "";
        let valorCasillaPrecioKg = "";
        let valorCasillaUnidadesKg = "";
        switch (tipoClavo) {
            case 'granel':
                if (valoresProducto && valoresProducto.especialClavos) {
                    if (valoresProducto.especialClavos.precioKg) {
                        valorCasillaPrecioKg = valoresProducto.especialClavos.precioKg;
                    };
                    if (valoresProducto.especialClavos.unidadesKg) {
                        valorCasillaUnidadesKg = valoresProducto.especialClavos.unidadesKg;
                    };
                };
                return (
                    <>
                        <TextField
                            label="Uds/Kg"
                            value={valorCasillaUnidadesKg}
                            onChange={(event) => handleChange(event, 'unidadesKg')}
                            variant="outlined"
                            className="w-full md:w-[50%] xl:w-[25%]"
                            type="number"
                        />
                        <TextField
                            label="Precio Kg"
                            value={valorCasillaPrecioKg}
                            onChange={(event) => handleChange(event, 'precioKg')}
                            variant="outlined"
                            className="w-full md:w-[50%] xl:w-[25%]"
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">€</InputAdornment>
                            }}
                        />
                    </>
                )
                break;
            case 'bobina':
                if (valoresProducto && valoresProducto.especialClavos) {
                    if (valoresProducto.especialClavos.precioBobina) {
                        valorCasillaPrecioBobina = valoresProducto.especialClavos.precioBobina;
                    };
                    if (valoresProducto.especialClavos.unidadesBobina) {
                        valorCasillaUnidadesBobina = valoresProducto.especialClavos.unidadesBobina;
                    };
                };
                return (
                    <>
                        <TextField
                            label="Uds/bobina"
                            value={valorCasillaUnidadesBobina}
                            onChange={(event) => handleChange(event, 'unidadesBobina')}
                            variant="outlined"
                            className="w-full md:w-[50%] xl:w-[25%]"
                            type="number"
                        />
                        <TextField
                            label="Precio bobina"
                            value={valorCasillaPrecioBobina}
                            onChange={(event) => handleChange(event, 'precioBobina')}
                            variant="outlined"
                            className="w-full md:w-[50%] xl:w-[25%]"
                            type="number"
                            InputProps={{
                                endAdornment: <InputAdornment position="end">€</InputAdornment>
                            }}
                        />
                    </>
                )
                break;
            default:
                return (
                    <TextField
                        label="Cálculo"
                        value=""
                        variant="outlined"
                        className="w-full md:w-[50%] xl:w-[50%]"
                        disabled={true}
                    />
                )
        };
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
                    className="w-full md:w-[50%] xl:w-[50%]"
                />
                <TextField
                    label="SAGE"
                    value={valoresProducto.sage}
                    onChange={(event) => handleChange(event, 'sage')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[50%]"
                />
                <FormControl variant="outlined" className="w-full md:w-[50%] xl:w-[25%]">
                    <InputLabel>Formato</InputLabel>
                    <Select
                        label="Formato"
                        value={valoresProducto.categoria}
                        onChange={(event) => { handleChange(event, 'categoria'); setTipoClavo(event.target.value) }}
                    >
                        <MenuItem value="">
                            <em>Formato</em>
                        </MenuItem>
                        <MenuItem value={'granel'}>Granel</MenuItem>
                        <MenuItem value={'bobina'}>Bobina</MenuItem>
                    </Select>
                </FormControl>
                {retornaFormatoCasillas()}
                <TextField
                    label="Precio ud."
                    value={valoresProducto.precioUnitario || ""}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[25%]"
                    InputProps={{
                        endAdornment: <InputAdornment position="end">€</InputAdornment>,
                        readOnly: true,
                    }}
                    disabled={tipoClavo ? false : true}
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
                    <Tooltip
                        arrow
                        placement="top-start"
                        title={retornaTitleTooltipGrabar()}
                    >
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

export default FilaMod2;
