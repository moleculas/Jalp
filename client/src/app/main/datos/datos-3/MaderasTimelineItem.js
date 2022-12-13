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

function MaderasTimelineItem({ item, last }) {
    return (
        <TimelineItem>
            <TimelineSeparator>
                <TimelineDot
                    color="primary"
                    className="w-32 h-32 p-0 mt-0 flex items-center justify-center"
                >
                    <FuseSvgIcon size={18}>material-outline:checklist</FuseSvgIcon>
                </TimelineDot>
                {!last && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent className="flex flex-col items-start pt-0 pb-48">
                {item.descripcion}
                <Box
                    className="mt-16 py-16 pl-20 rounded-lg border w-full"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? lighten(theme.palette.background.default, 0.4)
                                : lighten(theme.palette.background.default, 0.02),
                    }}
                >
                    {item.historico.slice(0).reverse().map((cambio, index) => {
                        return (
                            <div key={'historico-' + index} className="flex flex-col mt-8 sm:mt-4 text-md leading-5">                                
                                <div>
                                    <Typography className="text-13" color="text.secondary" component="span">
                                        {`Mod: ${format(new Date(cambio.fecha), "d/MM/y", { locale: es })}`}
                                    </Typography>
                                    <span> &bull; </span>
                                    <Typography className="text-13" color="text.secondary" component="span">
                                        {`${cambio.activo ? `Activo` : `Inactivo`}`}
                                    </Typography>
                                </div>
                            </div>
                        )
                    })}
                </Box>
            </TimelineContent>
        </TimelineItem>
    );
}

export default MaderasTimelineItem;