import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';

//importacion acciones
import { selectUser } from 'app/redux/userSlice';
import { setPanelFormActivo, setPanelPassActivo } from 'app/redux/userPanel/userPanelSlice';

const UserView = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    if (!user) {
        return <FuseLoading />;
    };

    return (
        <>
            <Box
                className="relative w-full h-60 sm:h-92 px-32 sm:px-48"
                sx={{
                    backgroundColor: 'background.default',
                }}
            >
            </Box>
            <div className="relative flex flex-col flex-auto items-center px-48 pt-24 md:pt-0">
                <div className="w-full">
                    <div className="flex flex-col sm:flex-row flex-1 space-y-16 md:space-y-0 items-center md:items-end -mt-64">
                        <Avatar
                            sx={{
                                borderWidth: 4,
                                borderStyle: 'solid',
                                borderColor: 'background.paper',
                                backgroundColor: 'background.default',
                                color: 'text.secondary',
                            }}
                            className="w-128 h-128 text-64 font-bold"
                            src={user.data.photoURL}
                            alt={user.data.displayName}
                        >
                            {user.data.displayName.charAt(0)}
                        </Avatar>
                        <div className="flex items-center ml-auto mb-4">
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => dispatch(setPanelFormActivo(true))}
                                className="mr-12"
                            >
                                <FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
                                <span className="mx-8">Editar</span>
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => dispatch(setPanelPassActivo(true))}
                            >
                                <FuseSvgIcon size={20}>heroicons-outline:key</FuseSvgIcon>
                                <span className="mx-8">Contraseña</span>
                            </Button>
                        </div>
                    </div>
                    <Typography className="mt-12 text-2xl md:text-4xl font-bold truncate">{user.data.displayName}</Typography>
                    <div className="flex flex-wrap items-center mt-8">
                        {user.role.map((role, index) => (
                            <Chip
                                key={index}
                                label={role}
                                className="capitalize mr-12 mb-12"
                                size="small"
                            />
                        ))}
                    </div>
                    <Divider className="mt-16 mb-24" />
                    <div className="flex flex-col space-y-32">
                        <div className="flex">
                            <FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
                            <div className="min-w-0 ml-24 space-y-4">
                                <div className="flex items-center leading-6" >
                                    <a
                                        className="hover:underline text-primary-500"
                                        href={`mailto: ${user.data.email}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {user.data.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                        {user.data.telefono.some((item) => item.telefono.length > 0) && (
                            <div className="flex">
                                <FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
                                <div className="min-w-0 ml-24 space-y-4">
                                    {user.data.telefono.map(
                                        (item, index) =>
                                            item.telefono !== '' && (
                                                <div className="flex items-center leading-6" key={index}>
                                                    <div className="ml-10 font-mono">{item.telefono}</div>

                                                    {item.etiqueta && (
                                                        <>
                                                            <Typography className="text-md truncate" color="text.secondary">
                                                                <span className="mx-8">&bull;</span>
                                                                <span className="font-medium">{item.etiqueta}</span>
                                                            </Typography>
                                                        </>
                                                    )}
                                                </div>
                                            )
                                    )}
                                </div>
                            </div>
                        )}
                        {user.data.direccion && (
                            <div className="flex items-center">
                                <FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
                                <div className="ml-24 leading-6">{user.data.direccion}</div>
                            </div>
                        )}
                        {user.data.fechaNacimiento && (
                            <div className="flex items-center">
                                <FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
                                <div className="ml-24 leading-6">
                                    {format(new Date(user.data.fechaNacimiento), "d 'de' MMMM 'de' y", { locale: es })}
                                </div>
                            </div>
                        )}
                        {user.data.descripcion && (
                            <div className="flex">
                                <FuseSvgIcon>heroicons-outline:menu-alt-2</FuseSvgIcon>
                                <div
                                    className="max-w-none ml-24 prose dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: user.data.descripcion }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserView;
