import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useContext, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { lighten } from '@mui/material/styles';
import ContactListItem from './ContactListItem';
import ContactAvatar from '../../ContactAvatar';
import { ChatAppContext } from '../../ChatApp';
import IconButton from '@mui/material/IconButton';

//importación acciones
import { selectContacts } from 'app/redux/chat/contactsSlice';
import { selectChats } from 'app/redux/chat/chatsSlice';
import { selectUser } from 'app/redux/chat/userSlice';
import { getChat } from 'app/redux/chat/chatSlice';

function MainSidebar(props) {
  const { setUserSidebarOpen } = useContext(ChatAppContext);
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);
  const chats = useSelector(selectChats);
  const user = useSelector(selectUser);
  const [searchText, setSearchText] = useState('');

  //funciones

  function handleSearchText(event) {
    setSearchText(event.target.value);
  };

  const retornaChats = () => {
    let chatsARetornar = [];
    let objetoUnido = {};
    chats.map((chat) => {
      if (chat.lastMessage) {
        contacts.forEach((contact, index) => {
          if (contact.id === chat.contactId && user.id === chat.usuario) {
            objetoUnido = { ...chat, ...contact, muted: chat.mutedUsuario, unreadCount: chat.unreadCountContactId };
          };
          if (user.id === chat.contactId && contact.id === chat.usuario) {
            objetoUnido = { ...chat, ...contact, muted: chat.mutedContactId, unreadCount: chat.unreadCountUsuario };
          };
        })
        chatsARetornar.push(objetoUnido)
      };
    });
    return chatsARetornar
  };

  return (
    <div className="flex flex-col flex-auto h-full">
      <Box
        className="py-16 px-32 border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}
      >
        <div className="flex justify-between items-center mb-16">
          {user && (
            <>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setUserSidebarOpen(true)}
                onKeyDown={() => setUserSidebarOpen(true)}
                role="button"
                tabIndex={0}
              >
                <ContactAvatar className="relative" contact={user} />
                <Typography className="mx-16 font-medium">{user.name}</Typography>
              </div>
              <IconButton
                size="large"
                className="-mx-16"
                onClick={() => setUserSidebarOpen(true)}
              >
                <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
              </IconButton>
            </>
          )}
        </div>
        {useMemo(
          () => (
            <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 h-40 rounded-full shadow-none">
              <FuseSvgIcon color="action" size={20}>
                heroicons-solid:search
              </FuseSvgIcon>
              <Input
                placeholder="Busca o empieza un nuevo chat"
                className="flex flex-1 px-8"
                disableUnderline
                fullWidth
                value={searchText}
                inputProps={{
                  'aria-label': 'Search',
                }}
                onChange={handleSearchText}
              />
            </Paper>
          ),
          [searchText]
        )}
      </Box>
      <FuseScrollbars className="overflow-y-auto flex-1">
        <List className="w-full">
          {useMemo(() => {
            function getFilteredArray(arr, _searchText) {
              if (_searchText.length === 0) {
                return arr;
              }
              return FuseUtils.filterArrayByString(arr, _searchText);
            };

            const chatListContacts =
              contacts.length > 0 && chats.length > 0
                ? retornaChats()
                : [];

            const filteredContacts = getFilteredArray([...contacts], searchText);
            const filteredChatList = getFilteredArray([...chatListContacts], searchText);
            const container = {
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            };

            const item = {
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            };

            return (
              <motion.div
                className="flex flex-col shrink-0"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredChatList.length > 0 && (
                  <motion.div variants={item}>
                    <Typography className="font-medium text-20 px-32 py-24" color="secondary.main">
                      Chats
                    </Typography>
                  </motion.div>
                )}
                {filteredChatList.length > 0 && (
                  filteredChatList.map((contact, index) => {
                    if (index + 1 <= chats.length) {
                      return (
                        < motion.div variants={item} key={contact.id + index} >
                          <div className={clsx(filteredChatList.length !== index + 1 && 'border-b-1')}>
                            <ContactListItem
                              chat
                              contact={contact}
                              onContactClick={(contactId) => dispatch(getChat(contactId))}
                            />
                          </div>
                        </motion.div>
                      )
                    }
                  }))}
                {filteredContacts.length > 0 && (
                  <motion.div variants={item}>
                    <Typography className="font-medium text-20 px-32 py-24" color="secondary.main">
                      Usuarios
                    </Typography>
                  </motion.div>
                )}
                {filteredContacts.length > 0 && (
                  filteredContacts.map((contact, index) => (
                    <motion.div variants={item} key={contact.id + index + 1}>
                      <div className={clsx(filteredContacts.length !== index + 1 && 'border-b-1')}>
                        <ContactListItem
                          contact={contact}
                          onContactClick={(contactId) => dispatch(getChat(contactId))}
                        />
                      </div>
                    </motion.div>
                  )))}
              </motion.div>
            );
          }, [contacts, chats, searchText, dispatch])}
        </List>
      </FuseScrollbars>
    </div >
  );
}

export default MainSidebar;
