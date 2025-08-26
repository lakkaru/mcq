import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

function TopNav() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, hasAccess } = useAuth();
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

  const handleOpenSubmenu = (event, index) => {
    setSubmenuAnchorEls((prev) => ({ ...prev, [index]: event.currentTarget }));
  };
  
  const handleCloseSubmenu = (index) => {
    setSubmenuAnchorEls((prev) => ({ ...prev, [index]: null }));
  };

  const handleMobileSubmenuOpen = (index) => {
    setMobileSubmenuIndex(index);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserMenuClick = (setting) => {
    handleCloseUserMenu();
    if (setting === 'Logout') {
      handleLogout();
    } else if (setting === 'Dashboard') {
      navigate('/');
    } else if (setting === 'Profile') {
      navigate('/profile');
    }
  };

  const pages = [
    {
      name: 'Exam',
      submenus: ['Create Exam', 'Update Exam', 'View Exam Paper'],
    },
    {
      name: 'Question',
      submenus: ['Create Question', 'Update Question'],
    },
    {
      name: 'Topic',
      submenus: ['View Topic'],
    },
    {
      name: 'Practice',
      submenus: ['Start Practice'],
    },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src="/logo192.png" alt="Logo" style={{ width: 40, height: 40 }} />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
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
            MCQ APP
          </Typography>

          {/* Mobile Menu */}
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
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {isAuthenticated && hasAccess(['admin', 'student']) &&
                pages.map((page, index) => (
                  <div key={page.name}>
                    <MenuItem onClick={() => handleMobileSubmenuOpen(index)}>
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                    {mobileSubmenuIndex === index && page.submenus && (
                      <Box sx={{ pl: 2 }}>
                        {page.submenus.map((submenu) => (
                          <MenuItem
                            key={submenu}
                            onClick={handleCloseNavMenu}
                            sx={{ pl: 4 }}
                          >
                            <Typography variant="body2">{submenu}</Typography>
                          </MenuItem>
                        ))}
                      </Box>
                    )}
                  </div>
                ))
              }
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
            <img src="/logo192.png" alt="Logo" style={{ width: 30, height: 30 }} />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
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
            MCQ APP
          </Typography>

          {/* Desktop Navigation Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated && hasAccess(['admin', 'student']) &&
              pages.map((page, index) => (
                <div key={page.name}>
                  <Button
                    onClick={(e) => handleOpenSubmenu(e, index)}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page.name}
                  </Button>
                  <Menu
                    anchorEl={submenuAnchorEls[index]}
                    open={Boolean(submenuAnchorEls[index])}
                    onClose={() => handleCloseSubmenu(index)}
                    sx={{ display: { xs: 'none', md: 'block' } }}
                  >
                    {page.submenus.map((submenu) => (
                      <MenuItem
                        key={submenu}
                        onClick={() => handleCloseSubmenu(index)}
                      >
                        {submenu}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              ))
            }
          </Box>

          {/* User Settings */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      {user?.name?.charAt(0) || 'U'}
                    </Avatar>
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
                  <MenuItem onClick={() => handleUserMenuClick('Dashboard')}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleUserMenuClick('Profile')}>
                    <AccountCircleIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleUserMenuClick('Logout')}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default TopNav;
