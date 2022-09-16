import { motion } from 'framer-motion';
import ListadoCubicajeTacos from './ListadoCubicajeTacos';
import FormulasCubicajeTacos from './FormulasCubicajeTacos';

function Produccion4() {
    const container = {
        show: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    return (
        <>
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-24 p-24"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div >
                    <ListadoCubicajeTacos />
                </div>
                <div  >
                    <FormulasCubicajeTacos />
                </div>
            </motion.div>
        </>
    );
}

export default Produccion4;
