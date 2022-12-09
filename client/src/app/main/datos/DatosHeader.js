import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

//importacion acciones

function DatosHeader(props) {

    return (
        <div className="flex flex-col sm:flex-row items-center space-y-16 sm:space-y-0 h-[101px] px-24 sm:px-32 w-full justify-between">
            <div className="flex flex-col sm:flex-row items-center pt-24 sm:pt-0 sm:space-x-12">
                <Typography
                    component={motion.span}
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    delay={300}
                    className="text-24 md:text-32 font-extrabold tracking-tight leading-none"
                >
                    Gestión de datos
                </Typography>
            </div>                    
        </div>
    );
}

export default DatosHeader;
