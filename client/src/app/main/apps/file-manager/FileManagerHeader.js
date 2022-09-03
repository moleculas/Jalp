import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

//importación acciones
import {
  selectFiles,
  selectFolders,
  selectPath,
  setSelectedItem,
  setSelectedButton
} from 'app/redux/file-manager/itemsSlice';

function FileManagerHeader(props) {
  const dispatch = useDispatch();
  const folders = useSelector(selectFolders);
  const files = useSelector(selectFiles);
  const path = useSelector(selectPath);

  return (
    <div className="p-24 sm:p-32 w-full flex flex-col sm:flex-row space-y-8 sm:space-y-0 items-center justify-between">
      <div className="flex flex-col items-center sm:items-start space-y-8 sm:space-y-0">
        <motion.span
          className="flex items-end"
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.2 } }}
          delay={300}
        >
          <Typography
            component={Link}
            to="/apps/file-manager"
            className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
            role="button"
          >
            Gestor de archivos
          </Typography>
          {path.length > 0 && (
            <Breadcrumbs
              aria-label="breadcrumb"
              className="mx-12"
              separator={<NavigateNextIcon fontSize="small" />}
            >
              <div />
              {path.map((item, index) =>
                index + 1 === path.length ? (
                  <Typography key={index}>{item.name}</Typography>
                ) : (
                  <Link key={index} color="text.primary" to={`/apps/file-manager/${item.id}`}>
                    {item.name}
                  </Link>
                )
              )}
            </Breadcrumbs>
          )}
        </motion.span>
        <Typography
          component={motion.span}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          delay={500}
          className="text-14 font-medium mx-2"
          color="text.secondary"
        >
          {`${folders.length} carpetas, ${files.length} archivos`}
        </Typography>
      </div>

      <div className="flex items-center -mx-8">
        <Button
          className="mx-8 whitespace-nowrap"
          onClick={() => { dispatch(setSelectedItem(null)), dispatch(setSelectedButton('folder')) }}
        >
          <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
          <span className="mx-8">Crear carpeta</span>
        </Button>
        <Button
          className="mx-8 whitespace-nowrap"
          variant="contained"
          color="secondary"
          startIcon={<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>}
          onClick={() => { dispatch(setSelectedItem(null)), dispatch(setSelectedButton('file')) }}
        >
          Subir archivo
        </Button>
      </div>
    </div>
  );
}

export default FileManagerHeader;
