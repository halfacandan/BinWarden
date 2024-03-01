import { styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';

const NavbarMenu = styled((props: MenuProps) => (
    //https://mui.com/material-ui/react-menu/

    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      {...props}
    />
  ))(({ theme }: {theme:any}) => ({
    '& .MuiPaper-root': {
      borderRadius: 0,
      minWidth: 180,
      color: '#fff',
      border: '1px solid #135199',
      backgroundColor: '#1565c0',
      '& .MuiMenu-list': { // This is the ul that contains the menu items
        padding: '4px 0',
      },
      '& a, a:active': { // This is the navigable link
        color: '#fff',
        textDecoration: "none",
        '& .MuiMenuItem-root': { // This is the li items that sit under the ul
          fontFamily: 'Geneva,Helvetica,sans-serif,Verdana,Arial',
          color: '#fff',
          fontSize: '100%',
          '& svg': { // This is the menu item's icon
            fontSize: 18,
            color: '#fff',
            marginRight: theme.spacing(1.5),
          },
          '&:active': {
            backgroundColor: '#1565c0',
          },
        },
      },
      '& hr':{
        borderWidth: "medium",
      },
    }
  }));

  export default NavbarMenu;