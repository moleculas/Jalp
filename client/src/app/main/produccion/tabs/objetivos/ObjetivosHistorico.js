import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import { motion } from 'framer-motion';
import Timeline from '@mui/lab/Timeline';
import ObjetivosTimelineItem from './ObjetivosTimelineItem';

//importacion acciones
import {
    selectObjetivos,
    getObjetivos
} from 'app/redux/produccion/objetivosSlice';

function ObjetivosHistorico() {
    const dispatch = useDispatch();
    const objetivos = useSelector(selectObjetivos);
    const item1 = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { delay: 0.1 } },
    };

    //useEffect

    useEffect(() => {
        if (!objetivos) {
            dispatch(getObjetivos());
        };
    }, [objetivos]);

    //funciones   

    if (!objetivos) {
        return null
    };

    return (
        <div className="flex flex-wrap w-full p-12">
            <div className="flex flex-col sm:flex-row flex-1 items-center px-12 justify-between mb-24 space-y-16 sm:space-y-0">
                <div>
                    <Typography className="text-2xl font-extrabold tracking-tight leading-tight">
                        Histórico objetivos producción
                    </Typography>
                    <div className="mt-2 font-medium">
                        <Typography>Secuencia de cambios en objetivos de producción.</Typography>
                    </div>
                </div>
            </div>
            <motion.div variants={item1} className="w-full flex flex-col">
                <Timeline                    
                    position="right"
                    sx={{
                        '& .MuiTimelineItem-root:before': {
                            display: 'none',
                        },
                    }}
                >
                    {objetivos.map((item, index) => (
                        <ObjetivosTimelineItem
                            last={objetivos.length === index + 1}
                            item={item}
                            key={item._id}
                        />
                    ))}
                </Timeline>
            </motion.div>
        </div>
    );
}

export default ObjetivosHistorico;
