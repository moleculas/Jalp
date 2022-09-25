import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

//importacion acciones

function CalculosHeader(props) {

    return (
        <div className="flex flex-col sm:flex-row items-center space-y-16 sm:space-y-0 h-[101px] px-24 sm:px-32 w-full justify-between">
            <div className="flex flex-col sm:flex-row items-center sm:space-x-12">
                <Typography
                    component={motion.span}
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    delay={300}
                    className="text-24 md:text-32 font-extrabold tracking-tight leading-none"
                >
                    Cálculos cubicaje
                </Typography>
            </div>            
        </div>
    );
}

export default CalculosHeader;
