import FuseUtils from '@fuse/utils';
import { useEffect, useState } from 'react';
import Masonry from 'react-masonry-css';
import { useSelector } from 'react-redux';
import withRouter from '@fuse/core/withRouter';
import { useParams } from 'react-router-dom';
import NoteListItem from './NoteListItem';
import { selectNotes, selectSearchText } from 'app/redux/notes/notesSlice';

function NoteList(props) {
  const notes = useSelector(selectNotes);
  const searchText = useSelector(selectSearchText);
  const params = useParams();
  const [filteredData, setFilteredData] = useState(null);

  //useEffect

  useEffect(() => {
    function filterData() {
      const { id, labelId } = params;
      let data = notes;
      if (searchText.length === 0) {
        return data;
      };
      data = FuseUtils.filterArrayByString(data, searchText);
      return data;
    };

    if (notes.length > 0) {
      setFilteredData(filterData());
    }
  }, [notes, searchText, params]);

  return !filteredData || filteredData.length === 0 ? (
    null
  ) : (
    <div className="flex flex-wrap w-full">
      <Masonry
        breakpointCols={{
          default: 6,
          1920: 5,
          1600: 4,
          1366: 3,
          1280: 4,
          960: 3,
          600: 2,
          480: 1,
        }}
        className="my-masonry-grid flex w-full"
        columnClassName="my-masonry-grid_column flex flex-col p-8 "
      >
        {filteredData.map((note) => (
          <NoteListItem
            key={note.id}
            note={note}
            className="w-full rounded-20 shadow mb-16"
          />
        ))}
      </Masonry>
    </div>
  );
}

export default withRouter(NoteList);
