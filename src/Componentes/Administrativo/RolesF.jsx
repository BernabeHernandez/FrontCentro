// frontend/src/components/Usuarios.js
import React, { useEffect, useState } from 'react';
import { Table, message, Spin } from 'antd'; // Importamos componentes de Ant Design
import { UserOutlined, CrownOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons'; // Importamos iconos de Ant Design

const RolesF = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/roles');
        if (!response.ok) {
          throw new Error('Error al cargar los usuarios');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (err) {
        setError(err.message);
        message.error('Error al cargar los usuarios'); // Mensaje de error
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div style={styles.errorMessage}>Error: {error}</div>;
  }

  const columns = [
    {
      title: <span style={styles.headerTitle}> Nombre</span>,
      dataIndex: 'nombre',
      key: 'nombre',
      align: 'center',
    },
    {
      title: <span style={styles.headerTitle}> Apellido Paterno</span>,
      dataIndex: 'apellidopa',
      key: 'apellidopa',
      align: 'center',
    },
    {
      title: <span style={styles.headerTitle}> Apellido Materno</span>,
      dataIndex: 'apellidoma',
      key: 'apellidoma',
      align: 'center',
    },
    {
      title: <span style={styles.headerTitle}> Correo Electrónico</span>,
      dataIndex: 'gmail',
      key: 'gmail',
      align: 'center',
    },
    {
      title: <span style={styles.headerTitle}> Usuario</span>,
      dataIndex: 'user',
      key: 'user',
      align: 'center',
    },
    {
      title: <span style={styles.headerTitle}> Teléfono</span>,
      dataIndex: 'telefono',
      key: 'telefono',
      align: 'center',
    },
    {
      title: <span style={styles.headerTitle}> Tipo</span>,
      dataIndex: 'tipo',
      key: 'tipo',
      align: 'center',
      render: (tipo) => (
        <span style={{ display: 'flex', alignItems: 'center', color: tipo === 'Cliente' ? '#3f8600' : '#faad14', fontWeight: 'bold' }}>
          {tipo === 'Cliente' ? <UserOutlined style={{ marginRight: '8px' }} /> : <CrownOutlined style={{ marginRight: '8px' }} />}
          {tipo}
        </span>
      ),
    },
    {
      title: <span style={styles.headerTitle}> Módulos de Acceso</span>,
      dataIndex: 'modulos',
      key: 'modulos',
      align: 'center',
    },
  ];

  const rowClassName = (record) => {
    return record.tipo === 'Cliente' ? 'cliente-row' : 'administrativo-row';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Usuarios y Roles</h2>
      <Table
        dataSource={usuarios}
        columns={columns}
        rowKey="id"
        rowClassName={rowClassName}
        pagination={false} // Desactivar paginación si no se necesita
        bordered // Añade bordes a la tabla
        style={styles.table} // Aplicar estilos a la tabla
        scroll={{ x: 'max-content' }} // Permitir desplazamiento horizontal
      />
    </div>
  );
};

// Estilos en un objeto
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    textAlign: 'center',
    marginBottom: '20px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '50px 0',
  },
  errorMessage: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#ff4d4f',
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    color: '#000', // Cambiado a negro
    fontWeight: 'bold',
  },
  table: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    overflow: 'hidden',
  },
};

// Agregamos estilos CSS para las filas de los usuarios
const css = `
.cliente-row {
  background-color: rgba(63, 134, 0, 0.1);
}

.administrativo-row {
  background-color: rgba(250, 173, 20, 0.1);
}

.ant-table-header {
  background-color: #1890ff; /* Color azul para el encabezado */
}

.ant-table-header-column {
  color: #000; /* Color negro para el texto del encabezado */
  font-weight: bold; /* Negrita */
  padding: 16px; /* Espaciado interno */
}

.ant-table-header > tr > th {
  background-color: #1890ff; /* Color azul del encabezado */
  color: #000; /* Color negro del texto del encabezado */
  font-weight: bold; /* Negrita */
}

.ant-table-cell {
  border-bottom: 1px solid #e8e8e8; /* Borde entre filas */
}

.ant-table-row:hover {
  background-color: #f0f5ff; /* Color al pasar el mouse sobre la fila */
}
`;

// Inyectamos estilos en el documento
const styleElement = document.createElement('style');
styleElement.innerHTML = css;
document.head.appendChild(styleElement);

export default RolesF;
