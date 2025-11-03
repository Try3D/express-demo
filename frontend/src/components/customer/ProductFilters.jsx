import { useState, useEffect } from 'react'

const ProductFilters = ({ categories, onFilter }) => {
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    onFilter({
      categoryId: selectedCategory,
      search: searchTerm
    })
  }, [selectedCategory, searchTerm, onFilter])

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <section className="collection-filters">
      <div className="page-width">
        <div className="collection-filters__inner">
          <div className="facets">
            <div className="facet-filters">
              <div className="field">
                <select 
                  className="select__select" 
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <svg aria-hidden="true" focusable="false" className="icon icon-caret" viewBox="0 0 10 6">
                  <path fillRule="evenodd" clipRule="evenodd" d="m9.354.646a.5.5 0 0 0-.708 0L5 4.293 1.354.646a.5.5 0 0 0-.708.708l4 4a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="field">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="field__input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductFilters