import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { Box } from '@mui/system';
import { useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ContactAvatar from '../../ContactAvatar';
import { es } from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

//importación acciones
import { setTemporizadorOn } from 'app/redux/chat/chatSlice';
import { selectContacts } from 'app/redux/chat/contactsSlice';

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  '&.active': {
    backgroundColor: theme.palette.background.default,
  },
}));

function ContactListItem(props) {
  const { chat, contact } = props;
  const routeParams = useParams();
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const [contacto, setContacto] = useState(null);

  //useEffect

  useEffect(() => {
    if (!contacto) {
      const elcontacto = contacts.find(contacto => contacto.id === contact.id);
      setContacto(elcontacto);
    };
  }, [contacto]);

  return (
    <StyledListItem
      button
      className="px-32 py-12 min-h-80"
      active={routeParams.id === contact.id ? 1 : 0}
      component={NavLinkAdapter}
      to={`/apps/chat/${contact.id}`}
      end
      activeClassName="active"
      onClick={() => routeParams.id && routeParams.id !== contact.id && dispatch(setTemporizadorOn(false))}
    >
      {contacto && <ContactAvatar contact={contacto} />}
      <ListItemText
        classes={{
          root: 'min-w-px px-16',
          primary: 'font-medium text-14',
          secondary: 'truncate',
        }}
        primary={contact.name}
        secondary={chat ? contact.lastMessage : contact.about}
      />
      {contact.contactId && (
        <div className="flex flex-col justify-center items-end">
          {contact?.lastMessageAt && (
            <Typography
              className="whitespace-nowrap mb-8 font-medium text-12"
              color="text.secondary"
            >
              {format(new Date(contact.lastMessageAt), 'PP', { locale: es })}
            </Typography>
          )}
          <div className="items-center">
            {contact.muted && (
              <FuseSvgIcon size={20} color="disabled">
                heroicons-solid:volume-off
              </FuseSvgIcon>
            )}
            {Boolean(contact.unreadCount) && !contact.muted && (
              <Box
                sx={{
                  backgroundColor: 'secondary.main',
                  color: 'secondary.contrastText',
                }}
                className="flex items-center justify-center min-w-20 h-20 rounded-full font-medium text-10 text-center"
              >
                {contact.unreadCount}
              </Box>
            )}
          </div>
        </div>
      )}
    </StyledListItem>
  );
}

export default ContactListItem;
