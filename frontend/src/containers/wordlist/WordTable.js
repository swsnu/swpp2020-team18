import React, { useEffect, useState } from 'react'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import { connect } from 'react-redux'
import * as wordlist from '../../ducks/wordlist'
import PropTypes from 'prop-types'
import DeleteIcon from '@material-ui/icons/Delete'
import { IconButton } from '@material-ui/core'

const columns = [
  { id: 'word', label: 'Word', minWidth: 100, align: 'center' },
  { id: 'phrase', label: 'Phrase', minWidth: 170, align: 'center' },
  {
    id: 'meaning',
    label: 'Meaning',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'confidence',
    label: 'Confidence',
    minWidth: 100,
    align: 'center',
  },
  {
    id: 'deleteIcon',
    label: '',
    minWidth: 100,
    align: 'center',
  },
]

function createData(word, phrase, meaning, confidence, createdAt) {
  return {
    word,
    phrase,
    meaning,
    confidence,
    createdAt,
    // deleteIcon: <IconButton edge="end" aria-label="delete" onClick={() => onRemove(phrase)}><DeleteIcon /></IconButton>,
  }
}

// const handleClick = (event, name) => {
//   const selectedIndex = selected.indexOf(name);
//   let newSelected = [];

//   if (selectedIndex === -1) {
//     newSelected = newSelected.concat(selected, name);
//   } else if (selectedIndex === 0) {
//     newSelected = newSelected.concat(selected.slice(1));
//   } else if (selectedIndex === selected.length - 1) {
//     newSelected = newSelected.concat(selected.slice(0, -1));
//   } else if (selectedIndex > 0) {
//     newSelected = newSelected.concat(
//       selected.slice(0, selectedIndex),
//       selected.slice(selectedIndex + 1),
//     );
//   }

//   setSelected(newSelected);
// };

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: '#414141',
    color: '#f5f5f5',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell)

const useStyles = makeStyles({
  root: {
    width: '80%',
    margin: '0 auto',
  },
  container: {
    maxHeight: 440,
  },
})

function StickyHeadTable(props) {
  const classes = useStyles()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [rows, setRows] = useState([])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const onRemove = (phrase) => {
    const result = window.confirm('Are you sure you want to remove this word?')
    if (result) {
      props
        .onWordRemove(phrase)
        .then(() => props.onWordlistOpen())
        .then((res) => {
          let tempRowData = []
          res.data.map((rowData) => {
            let dataWithRemoveButton = createData(
              rowData['word'],
              rowData['phrase'],
              rowData['korean_meaning'],
              rowData['confidence'],
              rowData['created_at']
            )
            dataWithRemoveButton['deleteIcon'] = (
              <IconButton
                edge='end'
                aria-label='delete'
                onClick={() => onRemove(rowData['phrase'])}
              >
                <DeleteIcon />
              </IconButton>
            )
            tempRowData.push(dataWithRemoveButton)
          })
          tempRowData.sort(function (a, b) {
            if (a.createdAt < b.createdAt) {
              return 1
            }
            if (a.createdAt > b.createdAt) {
              return -1
            }
            return 0
          })
          setRows(tempRowData)
        })
    }
  }

  useEffect(() => {
    props.onWordlistOpen().then((res) => {
      let tempRowData = []
      res.data.map((rowData) => {
        let dataWithRemoveButton = createData(
          rowData['word'],
          rowData['phrase'],
          rowData['korean_meaning'],
          rowData['confidence'],
          rowData['created_at']
        )
        dataWithRemoveButton['deleteIcon'] = (
          <IconButton
            edge='end'
            aria-label='delete'
            onClick={() => onRemove(rowData['phrase'])}
          >
            <DeleteIcon />
          </IconButton>
        )
        tempRowData.push(dataWithRemoveButton)
      })
      tempRowData.sort(function (a, b) {
        if (a.createdAt < b.createdAt) {
          return 1
        }
        if (a.createdAt > b.createdAt) {
          return -1
        }
        return 0
      })
      setRows(tempRowData)
    })
  }, [])

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow className={classes.tableHead}>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id]
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    onWordlistOpen: () => dispatch(wordlist.getWordlist()),
    onWordRemove: (phrase) => dispatch(wordlist.removeWord(phrase)),
  }
}

StickyHeadTable.propTypes = {
  onWordlistOpen: PropTypes.func,
  onWordRemove: PropTypes.func,
}

export default connect(null, mapDispatchToProps)(StickyHeadTable)
