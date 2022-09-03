import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import Chip from '@mui/material/Chip';

//importación acciones
import { selectDataInicioWidgets } from 'app/redux/produccion/inicioSlice';

function BudgetDetailsWidget(props) {
  const widgets = useSelector(selectDataInicioWidgets);
  const { columns, rows } = widgets?.budgetDetails;

  return (
    <Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
      <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
        Presupuesto detallado
      </Typography>

      <div className="table-responsive">
        <Table className="w-full min-w-full">
          <TableHead>
            <TableRow>
              {columns.map((column, index) => (
                <TableCell key={index}>
                  <Typography
                    color="text.secondary"
                    className="font-semibold text-12 whitespace-nowrap"
                  >
                    {column}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {Object.entries(row).map(([key, value]) => {
                  switch (key) {
                    case 'type': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Chip size="small" label={value} />
                        </TableCell>
                      );
                    }
                    case 'total':
                    case 'expensesAmount':
                    case 'remainingAmount': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="">
                            {value.toLocaleString('es-ES', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </Typography>
                        </TableCell>
                      );
                    }
                    case 'expensesPercentage':
                    case 'remainingPercentage': {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="">{`${value}%`}</Typography>
                        </TableCell>
                      );
                    }
                    default: {
                      return (
                        <TableCell key={key} component="th" scope="row">
                          <Typography className="">{value}</Typography>
                        </TableCell>
                      );
                    }
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Paper>
  );
}

export default memo(BudgetDetailsWidget);
