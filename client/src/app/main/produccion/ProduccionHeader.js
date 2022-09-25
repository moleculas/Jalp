import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import SelectorMes from '../componentes-app/SelectorMes';

//importacion acciones
import { decMesActual } from 'app/logica/produccion/logicaProduccion';

function ProduccionHeader(props) {
    const dispatch = useDispatch();
    const { anyo, mesNumero } = dispatch(decMesActual());

    return (
        <div className="flex flex-col sm:flex-row items-center space-y-16 sm:space-y-0 py-24 px-24 sm:px-32 w-full justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-12">
                <Typography
                    component={motion.span}
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    delay={300}
                    className="text-24 md:text-32 font-extrabold tracking-tight leading-none"
                >
                    Gestión de la producción
                </Typography>
            </div>
            <div className="flex items-center -mx-8">
                <SelectorMes
                    mesNumero={mesNumero}
                    anyo={anyo}
                />
            </div>
        </div>
    );
}

export default ProduccionHeader;
