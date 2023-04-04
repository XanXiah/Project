import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRecoilState } from 'recoil';
import { searchKeywordState } from './recoilstate';

const SearchBar : React.FC<{
    movies: any;
    onSearch: (filteredMovies: any) => void;
    onReset: () => void;
  }> = ({ movies, onSearch , onReset }) => {
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);

  const handleSearch = () => {
    if (searchKeyword) {
      const filteredMovies = movies.filter((movie:any) =>
        movie.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      onSearch(filteredMovies);
    }
  };

  const handleReset = () => {
    setSearchKeyword('');
    onReset();
  };

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search movies"
        value={searchKeyword}
        onChangeText={setSearchKeyword}
      />
      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
    paddingHorizontal: 10,
    margin: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 5,
    fontSize: 16,
    borderRadius: 20,
  },
  resetButton: {
    borderRadius: 20,
    marginLeft: 5,
    backgroundColor: '#666666',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  searchButton: {
    borderRadius: 20,
    marginLeft: 5,
    backgroundColor: '#4d4dff',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchBar;
