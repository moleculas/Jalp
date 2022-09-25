import { motion } from 'framer-motion';

function Calculos2() {
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
                    
                </div>                
            </motion.div>
        </>
    );
}

export default Calculos2;
