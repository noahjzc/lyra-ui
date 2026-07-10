import { Button, Dialog, DialogContent, DialogTitle } from '@noah-ji/lyra-ui';
import { SelectField } from '@noah-ji/lyra-ui/data-input';
import {
  DataTable,
  type DataTableColumn,
} from '@noah-ji/lyra-ui/data-view/data-table';
import { Z_BASE } from '@noah-ji/lyra-ui/overlay';
import { createRoot } from 'react-dom/client';
import '@noah-ji/lyra-ui/styles.css';

interface Row {
  id: string;
  name: string;
}
const columns: DataTableColumn<Row>[] = [
  { accessorKey: 'name', header: '名称' },
];

function App() {
  return (
    <main>
      <Button variant="primary">保存</Button>
      <SelectField options={[{ label: '启用', value: 'enabled' }]} />
      <DataTable columns={columns} data={[{ id: '1', name: '客户 A' }]} />
      <Dialog open>
        <DialogContent style={{ zIndex: Z_BASE.dialog }}>
          <DialogTitle>确认</DialogTitle>
        </DialogContent>
      </Dialog>
    </main>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Consumer root element is missing');

createRoot(root).render(<App />);
