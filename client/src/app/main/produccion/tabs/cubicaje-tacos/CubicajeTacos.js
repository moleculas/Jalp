import { motion } from 'framer-motion';
import ListadoCubicajeTacos from './ListadoCubicajeTacos';
import FormulasCubicajeTacos from './FormulasCubicajeTacos';

function CubicajeTacos() {
    const container = {
        show: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item1 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    const item2 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.4 } },
    };

    return (
        <>
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-24 p-24"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <motion.div variants={item1} >
                    <ListadoCubicajeTacos />
                </motion.div>
                <motion.div variants={item2} >
                    <FormulasCubicajeTacos />
                </motion.div>
            </motion.div>
        </>
    );
}

export default CubicajeTacos;
