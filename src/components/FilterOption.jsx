import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 13,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function FilterOption({ filterName, rowData=[], columnDefs=[], handleFilterInputChange }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDropdownListData = () => {
    let newRowData = rowData.map((row) => {
      return row[filterName.field];
    });

    return [...new Set(newRowData)];
  };

  const createStateForCheckBoxes = (numberOfCheckBoxes) => {
    if(numberOfCheckBoxes > 0) {
      let checkBoxesResult = [];
      for(let i = 0; i < numberOfCheckBoxes; i++){
        checkBoxesResult.push({
          ['checkbox'+i]: true
        });
      }
      return checkBoxesResult;
    } else {
      return [];
    }
  };

  const filterDropdownData = filterName.hasOwnProperty('field') && filterName.field !== undefined ? handleDropdownListData() : "";
  const [state, setState] = React.useState(filterDropdownData.length === 0 ? [] : createStateForCheckBoxes(filterDropdownData.length));

  const handleCheck = (indexOfCheckbox, isChecked) => {
    let updatedState = [...state];
    updatedState[indexOfCheckbox]['checkbox'+indexOfCheckbox] = !isChecked;

    let filterByText = filterDropdownData.filter((filterOption, index) => {
      if(updatedState[index]['checkbox'+index]) {
        return filterOption;
      }
      return null;
    });

    let filterResult = rowData.filter((element) => {
      let res = "";
      for(let i = 0; i < filterByText.length; i++) {
        if(element[filterName.field].toLowerCase() === filterByText[i].toLowerCase()) {
          res = element;
        }
      }
      return res;
    });
    
    handleFilterInputChange(filterResult);
    setState(updatedState);
  };

  const handleReset = () => {
    handleFilterInputChange(rowData);
    setState(createStateForCheckBoxes(filterDropdownData.length));
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        style={{ background: '#FDFDFD', color: '#2C2C2C', textTransform: 'none' }}
      >
        {filterName.headerName}
      </Button>
      {columnDefs.length > 0 && filterName.headerName === 'All filters' ?
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          {columnDefs.map((option, index) => {
            if(option.hasOwnProperty('filterType')) {
              return <MenuItem key={index} onClick={handleClose} disableRipple>
                        {option.headerName}
                      </MenuItem>
            }
            return "";
          })}
        </StyledMenu>
      :
        <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            key={0}
            disabled={true}
          >
            {filterName.headerName}
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          {filterDropdownData.map((columnFilterName, index) => {
            return <MenuItem key={index+1} disableRipple>
              <FormGroup>
                <FormControlLabel 
                  control={
                    <Checkbox 
                      style={{
                        transform: "scale(1.5)",
                        padding: '0 0 0 10px'
                      }}
                      checked={state[index]['checkbox'+index]}
                      onChange={() => handleCheck(index, state[index]['checkbox'+index])}
                    />} 
                  label={columnFilterName} />
              </FormGroup>
            </MenuItem>
          })}
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            key={filterDropdownData.length+2}
            sx={{
              '&:hover': {
                background:'none'
              },
            }}
          >
            <Button onClick={handleReset}>Reset</Button>
          </MenuItem>
        </StyledMenu>
      }
    </div>
  );
}