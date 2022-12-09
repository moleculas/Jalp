import { useSelector } from 'react-redux';
import Timeline from '@mui/lab/Timeline';
import ClavosTimelineItem from './ClavosTimelineItem';
import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';

//importacion acciones
import { selectProductos } from 'app/redux/produccion/productoSlice';

function SidebarHistorico2() {
    const productos = useSelector(selectProductos);
    const container = {
        show: {
            transition: {
                staggerChildren: 0.01,
            },
        },
    };
    const item2 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.5 } },
    };

    if (!productos) {
        return null
    };

    return (
        <motion.div
            className="w-full p-36"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <div className="flex flex-col sm:flex-row mb-24">
                <div>
                    <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                        Histórico producto
                    </Typography>
                    <div className="mt-2 font-medium">
                        <Typography>Secuencia de cambios en producto.</Typography>
                    </div>
                </div>
            </div>
            <motion.div variants={item2} className="w-full">
                <Timeline
                    position="right"
                    sx={{
                        '& .MuiTimelineItem-root:before': {
                            display: 'none',
                        },
                    }}
                >
                    {productos.map((item, index) => (
                        <ClavosTimelineItem
                            last={productos.length === index + 1}
                            item={item}
                            key={item._id}
                        />
                    ))}
                </Timeline>
            </motion.div>
        </motion.div>
    );
}

export default SidebarHistorico2;