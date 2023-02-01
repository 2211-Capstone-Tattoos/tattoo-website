import React from 'react'
import { useState, useRef } from 'react'
import { useGetAllArtistsQuery, useGetAllProductsQuery } from '../../api/shopAPI'
import { useAddProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '../../api/shopAPI'

const AdminProducts = () => {
  const { data = [], isLoading, isFetching, isError } = useGetAllProductsQuery()
  const [addProduct] = useAddProductMutation();
  const [updateProduct] = useUpdateProductMutation()
  const [deleteProduct] = useDeleteProductMutation()
  const [search, setSearch] = useState('')
  const [addView, setAddView] = useState(false)
  const [editView, setEditView] = useState(null)
  const [title, setTitle] = useState('NewProduct')
  const [description, setDescription] = useState('This is a new product')
  const [price, setPrice] = useState(0)
  const [artistId, setArtistId] = useState('1')
  const artistData = useGetAllArtistsQuery()



  console.log(artistData.data)

  console.log(data)
  const handleSubmit = async (productId) => {
    const body = {
      title: title,
      description: description,
      price: price,
      artistId: artistId
    }
    if (addView) {
      const newProduct = await addProduct({ artistId, body })
    }
    if (editView) {
      const updatedProduct = await updateProduct({ productId: productId, body })

    }
    setAddView(false)
    setEditView(false)
    setTitle('NewProduct')
    setDescription('This is a new product')
    setPrice(0)
    setArtistId('1')
  }

  const handleClose = () => {
    setAddView(false)
    setTitle('NewProduct')
    setDescription('This is a new product')
    setPrice('$0')
    setArtistId('1')
  }

  const handleOpenEdit = (product) => {
    setAddView(false)
    setEditView(product.id)
    setTitle(product.title)
    setDescription(product.description)
    setPrice(product.price)
    setArtistId(product.fullname)
  }

  const toggleActive = async (product) => {
    if (product.active) {
      if (confirm(`Are you sure you want to delete ${product.title}?`)) {
        const deletedProduct = await deleteProduct({ productId: product.id })
      }
    } else {
      const body = {
        active: true
      }
      await updateProduct({ productId: product.id, body })
    }
  }

  return (
    <div className="admin-products">
      <div>

        All Products
        <div className="search-bar">
          <input onChange={(e) => setSearch(e.target.value)}></input>
        </div>
      </div>



      <table class="sortable">

        <thead>
          <tr>
            <th>id</th>
            <th>artist</th>
            <th>title</th>
            <th>description</th>
            <th>price</th>
            <th>active</th>

          </tr>
          {
            addView
              ? <button onClick={() => handleClose()}>Close</button>
              : <button onClick={() => setAddView(true)}>Add Product</button>
          }
        </thead>
        <tbody>
          {addView
            ? <tr style={{ backgroundColor: 'red' }}>
              <td>-</td>
              <td><select onChange={(e) => setArtistId(e.target.value)}>
                <option>---</option>
                {artistData.data.map(artist => {
                  return (
                    <option value={artist.id}>{artist.fullname}</option>
                  )
                })

                }
              </select></td>
              <td contentEditable onInput={(e) => setTitle(e.currentTarget.textContent)}>NewProduct</td>
              <td><div contentEditable onInput={(e) => setDescription(e.currentTarget.textContent)}>This is a new product</div></td>
              <td>$<div contentEditable onInput={(e) => setPrice(e.currentTarget.textContent)}>0</div></td>
              <td><button onClick={() => handleSubmit()}>{"\u2714"}</button></td>

            </tr>
            : <></>
          }
          {[...data]
            .sort((a, b) => {
              return (a.id - b.id)
            })
            .filter(product => {
              if (product.title?.toLowerCase().includes(search?.toLowerCase()
              ) || product.description?.toLowerCase().includes(search?.toLowerCase()
              ))
                return true
            })
            .map((product) => {
              if (editView === product.id && !addView) {
                return (
                  <tr style={{ backgroundColor: 'red', color: 'black' }}>
                    <td>{product.id}</td>
                    <td><select onChange={(e) => setArtistId(e.target.value)}>
                      <option>---</option>
                      {artistData.data.map(artist => {
                        return (
                          <option value={artist.id}>{artist.fullname}</option>
                        )
                      })

                      }
                    </select></td>
                    <td><div contentEditable onInput={(e) => setTitle(e.currentTarget.textContent)}>{product.title}</div></td>
                    <td><div contentEditable onInput={(e) => setDescription(e.currentTarget.textContent)}>{product.description}</div></td>
                    <td>$<div contentEditable onInput={(e) => setPrice(e.currentTarget.textContent)}>{product.price.slice(1)}</div></td>
                    <td><a disabled={addView} onClick={() => toggleActive(product)}>{product.active ? "\u2714" : "\u274C"}</a></td>
                    <td><button onClick={() => handleSubmit(product.id)}>{"\u2714"}</button><button onClick={() => setEditView(null)}>{"\u274C"}</button></td>

                  </tr>
                )
              } else {
                return (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.artistId}</td>
                    <td>{product.title ? product.title : '---'}</td>
                    <td>{product.description ? product.description : '---'}</td>
                    <td>{product.price ? product.price : '---'}</td>
                    <td><a disabled={addView} onClick={() => toggleActive(product)}>{product.active ? "\u2714" : "\u274C"}</a></td>
                    <td><a disabled={addView} onClick={() => handleOpenEdit(product)}>Edit</a></td>
                  </tr>
                )
              }
            })}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProducts
