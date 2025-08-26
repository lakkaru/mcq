import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';

const pages = [
  {
    name: 'Exam',
    submenus: ['Create Exam', 'Update Exam', 'View Exam Paper', 'Delete Exam']
  },
  {
    name: 'Question',
    submenus: ['Create Question', 'Update Question', 'Delete Question']
  },
  {
    name: 'Topic',
    submenus: ['Create Topic', 'Update Topic', 'Delete Topic']
  }
];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function TopNav() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [submenuAnchorEls, setSubmenuAnchorEls] = React.useState({});
  const [mobileSubmenuIndex, setMobileSubmenuIndex] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
    setMobileSubmenuIndex(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Desktop submenu open/close handlers
  const handleOpenSubmenu = (event, index) => {
    setSubmenuAnchorEls((prev) => ({ ...prev, [index]: event.currentTarget }));
  };
  const handleCloseSubmenu = (index) => {
    setSubmenuAnchorEls((prev) => ({ ...prev, [index]: null }));
  };

  // Mobile submenu open/close handlers
  const handleMobileSubmenuOpen = (index) => {
    setMobileSubmenuIndex(index);
  };
  const handleMobileSubmenuClose = () => {
    setMobileSubmenuIndex(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MCQ <span ><sub style={{fontSize:'.5em'}}>master</sub></span>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page, idx) => (
                <div key={page.name}>
                  <MenuItem onClick={() => handleMobileSubmenuOpen(idx)}>
                    <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                  </MenuItem>
                  <Menu
                    anchorEl={anchorElNav}
                    open={mobileSubmenuIndex === idx}
                    onClose={handleMobileSubmenuClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    {page.submenus.map((submenu) => (
                    <MenuItem
                      key={submenu}
                      onClick={() => {
                        handleCloseNavMenu();
                        // Question menu navigation
                        if (submenu === 'Create Question') navigate('/questions/create');
                        else if (submenu === 'Update Question') navigate('/questions/update');
                        // Exam menu navigation
                        else if (submenu === 'Create Exam') navigate('/exams/create');
                        else if (submenu === 'Update Exam') navigate('/exams/update');
                        else if (submenu === 'View Exam Paper') navigate('/exams/view-paper');
                        // Add more submenu navigation as needed
                      }}
                    >
                      <Typography sx={{ textAlign: 'center' }}>{submenu}</Typography>
                    </MenuItem>
                    ))}
                  </Menu>
                </div>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, idx) => (
              <Box key={page.name} sx={{ position: 'relative' }}>
                <Button
                  onClick={(e) => handleOpenSubmenu(e, idx)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
                <Menu
                  anchorEl={submenuAnchorEls[idx]}
                  open={Boolean(submenuAnchorEls[idx])}
                  onClose={() => handleCloseSubmenu(idx)}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                >
                  {page.submenus.map((submenu) => (
                    <MenuItem
                      key={submenu}
                      onClick={() => {
                        handleCloseSubmenu(idx);
                        // Question menu navigation
                        if (submenu === 'Create Question') navigate('/questions/create');
                        else if (submenu === 'Update Question') navigate('/questions/update');
                        // Exam menu navigation
                        else if (submenu === 'Create Exam') navigate('/exams/create');
                        else if (submenu === 'Update Exam') navigate('/exams/update');
                        else if (submenu === 'View Exam Paper') navigate('/exams/view-paper');
                        // Add more submenu navigation as needed
                      }}
                    >
                      <Typography sx={{ textAlign: 'center' }}>{submenu}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default TopNav;
