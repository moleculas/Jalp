import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Toolbar from '@mui/material/Toolbar';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import ContactAvatar from '../ContactAvatar';
import { ChatAppContext } from '../ChatApp';
import { es } from 'date-fns/locale';
import Tooltip from '@mui/material/Tooltip';

//importación acciones
import {
  getChat,
  selectChat,
  sendMessage,
  selectTemporizadorOn,
  setTemporizadorOn,
  selectDatosChatEnUso,
  actualizarChat,
  selectEstadoUsuarioChat,
  setEstadoUsuarioChat,
  getActualizacionChat
} from 'app/redux/chat/chatSlice';
import { selectContactById } from 'app/redux/chat/contactsSlice';
import { selectUser } from 'app/redux/chat/userSlice';
import { selectChats } from 'app/redux/chat/chatsSlice';

const StyledMessageRow = styled('div')(({ theme }) => ({
  '&.contact': {
    '& .bubble': {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      '& .time': {
        marginLeft: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopLeftRadius: 20,
      },
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomLeftRadius: 20,
      },
    },
  },
  '&.me': {
    paddingLeft: 40,

    '& .bubble': {
      marginLeft: 'auto',
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.contrastText,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      '& .time': {
        justifyContent: 'flex-end',
        right: 0,
        marginRight: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopRightRadius: 20,
      },
    },

    '&.last-of-group': {
      '& .bubble': {
        borderBottomRightRadius: 20,
      },
    },
  },
  '&.contact + .me, &.me + .contact': {
    paddingTop: 20,
    marginTop: 20,
  },
  '&.first-of-group': {
    '& .bubble': {
      borderTopLeftRadius: 20,
      paddingTop: 13,
    },
  },
  '&.last-of-group': {
    '& .bubble': {
      borderBottomLeftRadius: 20,
      paddingBottom: 13,
      '& .time': {
        display: 'flex',
      },
    },
  },
}));

function Chat(props) {
  const { setMainSidebarOpen, setContactSidebarOpen } = useContext(ChatAppContext);
  const dispatch = useDispatch();
  const chat = useSelector(selectChat);
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const contactId = routeParams.id;
  const selectedContact = useSelector((state) => selectContactById(state, contactId));
  const chatRef = useRef(null);
  const [messageText, setMessageText] = useState('');
  const temporizadorOn = useSelector(selectTemporizadorOn);
  const datosChatEnUso = useSelector(selectDatosChatEnUso);
  const estadoUsuarioChat = useSelector(selectEstadoUsuarioChat);
  const chats = useSelector(selectChats);
  const navigate = useNavigate();

  //useEffect

  useEffect(() => {
    dispatch(getChat(contactId));
    setTimeout(() => {
      dispatch(setTemporizadorOn(true));
    }, 10000);
  }, [contactId, dispatch]);

  useEffect(() => {
    if (temporizadorOn) {
      const intervalId = setInterval(() => {
        dispatch(getActualizacionChat(datosChatEnUso.id));
      }, 10000);
      return () => clearInterval(intervalId);
    };
  }, [temporizadorOn, contactId, dispatch]);

  useEffect(() => {
    if (chat) {
      setTimeout(scrollToBottom);
    };
  }, [chat]);  

  useEffect(() => {
    if (!estadoUsuarioChat && chats.length > 0 && datosChatEnUso.id) {
      const elChat = chats.find(chat => chat.id === datosChatEnUso.id);
      if (user.id === elChat.contactId) {
        dispatch(setEstadoUsuarioChat('contactId'));
        return
      };
      dispatch(setEstadoUsuarioChat('usuario'));
    };
  }, [estadoUsuarioChat, chats, datosChatEnUso]);

  //funciones

  function scrollToBottom() {
    if (!chatRef.current) {
      return;
    }
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  function isFirstMessageOfGroup(item, i) {
    return i === 0 || (chat[i - 1] && chat[i - 1].contactId !== item.contactId);
  };

  function isLastMessageOfGroup(item, i) {
    return i === chat.length - 1 || (chat[i + 1] && chat[i + 1].contactId !== item.contactId);
  };

  function onInputChange(ev) {
    setMessageText(ev.target.value);
  };

  function onMessageSubmit(ev) {
    ev.preventDefault();
    if (messageText === '') {
      return;
    };
    const chatId = datosChatEnUso.id;
    dispatch(
      sendMessage({
        messageText,
        chatId,
        contactId,
        estadoUsuarioChat
      })
    ).then(() => {
      setMessageText('');
    });
  };

  const handleMuteChat = () => {
    const chatId = datosChatEnUso.id;
    let muted;
    if (estadoUsuarioChat === 'usuario') {
      muted = !datosChatEnUso.mutedUsuario;
    } else {
      muted = !datosChatEnUso.mutedContactId;
    };
    dispatch(actualizarChat({
      chatId,
      muted,
      estadoUsuarioChat
    }));
  };

  if (!user || !chat || !selectedContact) {
    return null;
  };

  return (
    <>
      <Box
        className="w-full border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}
      >
        <Toolbar className="flex items-center justify-between px-16 w-full">
          <div className="flex items-center">
            <IconButton
              aria-label="Open drawer"
              onClick={() => setMainSidebarOpen(true)}
              className="flex lg:hidden"
              size="large"
            >
              <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
            </IconButton>
            <div
              className="flex items-center"
            >
              <ContactAvatar className="relative mx-8" contact={selectedContact} />
              <Typography color="inherit" className="text-16 font-semibold px-4">
                {selectedContact.name}
              </Typography>
            </div>
          </div>
          <div className="-mx-8">
            {estadoUsuarioChat && (
              <Tooltip title={estadoUsuarioChat === 'usuario' ? (
                !datosChatEnUso.mutedUsuario ? 'Silenciar chat' : 'Reactivar chat'
              ) : (
                !datosChatEnUso.mutedContactId ? 'Silenciar chat' : 'Reactivar chat'
              )}
                placement="left">
                <IconButton
                  onClick={handleMuteChat}
                  size="large"
                >
                  <FuseSvgIcon>
                    {estadoUsuarioChat === 'usuario' ? (
                      !datosChatEnUso.mutedUsuario ? 'heroicons-outline:volume-up' : 'heroicons-outline:volume-off'
                    ) : (
                      !datosChatEnUso.mutedContactId ? 'heroicons-outline:volume-up' : 'heroicons-outline:volume-off'
                    )}
                  </FuseSvgIcon>
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Toolbar>
      </Box>
      <div className="flex flex-auto h-full min-h-0 w-full">
        <div className={clsx('flex flex-1 z-10 flex-col relative', props.className)}>
          <FuseScrollbars ref={chatRef} className="flex flex-1 flex-col overflow-y-auto">
            {chat?.length > 0 && (
              <div className="flex flex-col pt-16 px-16 pb-40">
                {chat.map((item, i) => {
                  if (item.value && item.value !== 'Primer_Mensaje_Chat') {
                    return (
                      <StyledMessageRow
                        key={i}
                        className={clsx(
                          'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
                          item.contactId === user.id ? 'me' : 'contact',
                          { 'first-of-group': isFirstMessageOfGroup(item, i) },
                          { 'last-of-group': isLastMessageOfGroup(item, i) },
                          i + 1 === chat.length && 'pb-96'
                        )}
                      >
                        <div className="bubble flex relative items-center justify-center p-12 max-w-full">
                          <div className="leading-tight whitespace-pre-wrap">{item.value}</div>
                          <Typography
                            className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                            color="text.secondary"
                          >
                            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: es })}
                          </Typography>
                        </div>
                      </StyledMessageRow>
                    );
                  };
                })}
              </div>
            )}
          </FuseScrollbars>
          {chat && (
            <Paper
              square
              component="form"
              onSubmit={onMessageSubmit}
              className="absolute border-t-1 bottom-0 right-0 left-0 py-16 px-16"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >
              <div className="flex items-center relative">
                <InputBase
                  autoFocus={false}
                  id="message-input"
                  className="flex-1 flex grow shrink-0 h-44 mx-8 px-16 border-2 rounded-full"
                  placeholder="Escribe tu mensaje"
                  onChange={onInputChange}
                  value={messageText}
                  sx={{ backgroundColor: 'background.paper' }}
                />
                <IconButton className="" type="submit" size="large">
                  <FuseSvgIcon className="rotate-90" color="action">
                    heroicons-outline:paper-airplane
                  </FuseSvgIcon>
                </IconButton>
              </div>
            </Paper>
          )}
        </div>    
      </div>
    </>
  );
}

export default Chat;
