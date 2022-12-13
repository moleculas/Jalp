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
import ToggleButton from '@mui/material/ToggleButton';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';

function FilaMod3(props) {
    const { producto, registrarFila, borrarFila, index } = props;
    const [valoresProducto, setValoresProducto] = useState(null);
    const [disabledGrabar, setDisabledGrabar] = useState(true);
    const [disabledModificado, setDisabledModificado] = useState(true);
    const pedidos = [
        'xavi',
        'masova',
        'sala',
    ];
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    
    //useEffect 

    useEffect(() => {
        if (producto) {
            setValoresProducto({
                _id: producto._id,
                descripcion: producto.descripcion,
                sage: producto.sage,
                tipoPedido: producto.tipoPedido,
                largo: producto.largo,
                ancho: producto.ancho,
                grueso: producto.grueso,
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
            valoresProducto.tipoPedido.length > 0 &&
            valoresProducto.largo &&
            valoresProducto.ancho &&
            valoresProducto.grueso
        ) {
            setDisabledGrabar(false);
        } else {
            setDisabledGrabar(true);
        };
    }, [valoresProducto]);

    //funciones  

    const handleChange = (event, tipo) => {
        let valor = event.target.value;
        if (tipo === "largo" || tipo === "ancho" || tipo === "grueso") {
            valor = Number(event.target.value)
        };
        setValoresProducto({ ...valoresProducto, [tipo]: valor });
        producto._id && (setDisabledModificado(false));
    };

    const handleChangeToggle = (valor) => {
        setValoresProducto({ ...valoresProducto, activo: valor });
        producto._id && (setDisabledModificado(false));
    };

    const retornaRenderValue = (selected) => {
        const selectedGest = selected.map((selected) => _.capitalize(selected));
        return selectedGest.join(', ')
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
                    className="w-full md:w-[50%] xl:w-[70%]"
                />
                <FormControl variant="outlined" className="w-full md:w-[50%] xl:w-[45%]">
                    <InputLabel>Pedido</InputLabel>
                    <Select
                        multiple
                        value={valoresProducto.tipoPedido}
                        onChange={(event) => handleChange(event, 'tipoPedido')}
                        input={<OutlinedInput label="Pedido" />}
                        renderValue={(selected) => retornaRenderValue(selected)}
                        MenuProps={MenuProps}
                    >
                        <MenuItem value="">
                            <em>Pedido</em>
                        </MenuItem>
                        {pedidos.map((pedido) => (
                            <MenuItem key={pedido} value={pedido}>
                                <Checkbox checked={valoresProducto.tipoPedido.indexOf(pedido) > -1} />
                                <ListItemText primary={_.capitalize(pedido)} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Largo"
                    value={valoresProducto.largo || ""}
                    onChange={(event) => handleChange(event, 'largo')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[25%]"
                    type="number"
                />
                <TextField
                    label="Ancho"
                    value={valoresProducto.ancho || ""}
                    onChange={(event) => handleChange(event, 'ancho')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[25%]"
                    type="number"
                />
                <TextField
                    label="Grueso"
                    value={valoresProducto.grueso || ""}
                    onChange={(event) => handleChange(event, 'grueso')}
                    variant="outlined"
                    className="w-full md:w-[50%] xl:w-[25%]"
                    type="number"
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

export default FilaMod3;
