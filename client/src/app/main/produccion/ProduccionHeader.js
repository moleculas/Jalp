import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import SelectorMes from './SelectorMes';

//importacion acciones
import { selectMesActual } from 'app/redux/produccion/inicioSlice';

function ProduccionHeader(props) {
    const mesActual = useSelector(selectMesActual);

    return (
        <div className="flex flex-col sm:flex-row items-center space-y-16 sm:space-y-0 py-24 px-24 sm:px-32 w-full flex justify-between">
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
                <SelectorMes prMesActual={mesActual} />
            </div>
        </div>
    );
}

export default ProduccionHeader;
