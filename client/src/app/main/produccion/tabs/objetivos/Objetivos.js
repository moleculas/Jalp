import { motion } from 'framer-motion';
import ObjetivosForm from './ObjetivosForm';
import ObjetivosHistorico from './ObjetivosHistorico';

function Objetivos() {
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
                <div>
                    <ObjetivosForm />
                </div>
                <div  >
                    <ObjetivosHistorico />
                </div>
            </motion.div>
        </>
    );
}

export default Objetivos;
