import {
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineSeparator,
} from '@mui/lab';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { lighten } from '@mui/material/styles';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';

function ObjetivosTimelineItem({ item, last }) {
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot
                    color="primary"
                    className="w-32 h-32 p-0 mt-0 flex items-center justify-center"
                >
                    <FuseSvgIcon size={18}>material-outline:layers</FuseSvgIcon>
                </TimelineDot>
                {!last && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent className="flex flex-col items-start pt-0 pb-48">
                {item.producto}
                <Box
                    className="mt-16 py-16 px-20 rounded-lg border"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? lighten(theme.palette.background.default, 0.4)
                                : lighten(theme.palette.background.default, 0.02),
                    }}
                >
                    <Typography className="font-bold">
                        Palets
                    </Typography>
                    {item.historicoPalets.slice(0).reverse().map((cambio, index) => {
                        return (
                            <div key={'historicoP-' + index} className="flex flex-col sm:flex-row sm:items-center mt-8 sm:mt-4 sm:space-x-8 text-md leading-5">
                                <Typography className="text-14">
                                    {`Cant: ${cambio.palets}`}
                                </Typography>
                                <div className="hidden sm:block">&bull;</div>
                                <Typography className="text-13" color="text.secondary">
                                    {`Modificado: ${format(new Date(cambio.fecha), "d/MM/y", { locale: es })}`}
                                </Typography>
                            </div>
                        )
                    })}
                    <Typography className="font-bold mt-8">
                        Saldo
                    </Typography>
                    {item.historicoSaldo.slice(0).reverse().map((cambio, index) => {
                        return (
                            <div key={'historicoP-' + index} className="flex flex-col sm:flex-row sm:items-center mt-8 sm:mt-4 sm:space-x-8 text-md leading-5">
                                <Typography className="text-14">
                                    {`Cant: ${cambio.saldo}`}
                                </Typography>
                                <div className="hidden sm:block">&bull;</div>
                                <Typography className="text-13" color="text.secondary">
                                    {`Modificado: ${format(new Date(cambio.fecha), "d/MM/y", { locale: es })}`}
                                </Typography>
                            </div>
                        )
                    })}
                </Box>
            </TimelineContent>
        </TimelineItem>
    );
}

export default ObjetivosTimelineItem;