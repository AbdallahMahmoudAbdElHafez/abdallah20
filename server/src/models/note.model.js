import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Note = sequelize.define('Note', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
      defaultValue: '#fff9c4', // Light yellow post-it color
    },
    position_x: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    position_y: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
    width: {
      type: DataTypes.INTEGER,
      defaultValue: 300,
    },
    height: {
      type: DataTypes.INTEGER,
      defaultValue: 300,
    },
    is_open: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }
  }, {
    tableName: 'notes',
    timestamps: true,
    underscored: true,
  });

  return Note;
};
