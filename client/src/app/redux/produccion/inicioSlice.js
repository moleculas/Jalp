import {
    createAsyncThunk,
    createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import format from 'date-fns/format';
import { es } from 'date-fns/locale';

//importación acciones
import { showMessage } from 'app/redux/fuse/messageSlice';

export const getNotesInicio = createAsyncThunk(
    'produccionSeccion/inicio/getNotesInicio',
    async (_, { getState, dispatch }) => {
        const user = getState().user;
        try {
            const response = await axios.get('/notes/mes/' + user.data.id);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getEventsInicio = createAsyncThunk(
    'produccionSeccion/inicio/getEventsInicio',
    async (_, { getState, dispatch }) => {
        const user = getState().user;
        try {
            const response = await axios.get('/calendar/events/mes/' + user.data.id);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getTasksInicio = createAsyncThunk(
    'produccionSeccion/inicio/getTasksInicio',
    async (_, { getState, dispatch }) => {
        const user = getState().user;
        try {
            const response = await axios.get('/tasks/mes/' + user.data.id);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

export const getChatsInicio = createAsyncThunk(
    'produccionSeccion/inicio/getChatsInicio',
    async (_, { getState, dispatch }) => {
        const user = getState().user;
        try {
            const response = await axios.get('/chat/pendientes/' + user.data.id);
            const data = await response.data;
            return data;
        } catch (err) {
            dispatch(showMessage({ message: err.response.data.message, variant: "error" }));
            return;
        };
    });

const initialState = {
    header: {
        notesInicio: [],
        eventsInicio: [],
        tasksInicio: []
    },
    menu: {
        chatsPendientes: []
    },
    widgets: {
        "summary": {
            "ranges": {
                "DY": "Ayer",
                "DT": "Hoy",
                "DTM": "Mañana"
            },
            "currentRange": "DT",
            "data": {
                "name": "Tareas vencidas",
                "count": {
                    "DY": 21,
                    "DT": 25,
                    "DTM": 19
                },
                "extra": {
                    "name": "Completedo",
                    "count": {
                        "DY": 6,
                        "DT": 7,
                        "DTM": "-"
                    }
                }
            },
            "detail": "You can show some detailed information about this widget in here."
        },
        "overdue": {
            "title": "Atrasado",
            "data": {
                "name": "Tareas",
                "count": 4,
                "extra": {
                    "name": "Retrasos ayer",
                    "count": 2
                }
            },
            "detail": "You can show some detailed information about this widget in here."
        },
        "issues": {
            "title": "Asuntos pendientes",
            "data": {
                "name": "Abiertos",
                "count": 32,
                "extra": {
                    "name": "Cerrados hoy",
                    "count": 0
                }
            },
            "detail": "You can show some detailed information about this widget in here."
        },
        "features": {
            "title": "Características",
            "data": {
                "name": "Propuestas",
                "count": 42,
                "extra": {
                    "name": "Implementadas",
                    "count": 8
                }
            },
            "detail": "You can show some detailed information about this widget in here."
        },
        "githubIssues": {
            "overview": {
                "this-week": {
                    "new-issues": 214,
                    "closed-issues": 75,
                    "fixed": 3,
                    "wont-fix": 4,
                    "re-opened": 8,
                    "needs-triage": 6
                },
                "last-week": {
                    "new-issues": 197,
                    "closed-issues": 72,
                    "fixed": 6,
                    "wont-fix": 11,
                    "re-opened": 6,
                    "needs-triage": 5
                }
            },
            "ranges": {
                "this-week": "Esta semana",
                "last-week": "Pasada semana"
            },
            "labels": [
                "Lun",
                "Mar",
                "Mié",
                "Jue",
                "Vie",
                "Sáb",
                "Dom"
            ],
            "series": {
                "this-week": [
                    {
                        "name": "Nuevos proyectos",
                        "type": "line",
                        "data": [
                            42,
                            28,
                            43,
                            34,
                            20,
                            25,
                            22
                        ]
                    },
                    {
                        "name": "Proyectos cerrados",
                        "type": "column",
                        "data": [
                            11,
                            10,
                            8,
                            11,
                            8,
                            10,
                            17
                        ]
                    }
                ],
                "last-week": [
                    {
                        "name": "Nuevos proyectos",
                        "type": "line",
                        "data": [
                            37,
                            32,
                            39,
                            27,
                            18,
                            24,
                            20
                        ]
                    },
                    {
                        "name": "Proyectos cerrados",
                        "type": "column",
                        "data": [
                            9,
                            8,
                            10,
                            12,
                            7,
                            11,
                            15
                        ]
                    }
                ]
            }
        },
        "budgetDistribution": {
            "categories": [
                "Conceptualización",
                "Diseño",
                "Desarrollo",
                "Extras",
                "Márketing"
            ],
            "series": [
                {
                    "name": "Presupuesto",
                    "data": [
                        12,
                        20,
                        28,
                        15,
                        25
                    ]
                }
            ]
        },
        "weeklyExpenses": {
            "amount": 17663,
            "labels": [
                "05 Ene - 12 Ene",
                "13 Ene - 20 Ene",
                "21 Ene - 28 Ene",
                "29 Ene - 05 Feb",
                "06 Feb - 13 Feb",
                "14 Feb - 21 Feb"
            ],
            "series": [
                {
                    "name": "Gastos",
                    "data": [
                        4412,
                        4345,
                        4541,
                        4677,
                        4322,
                        4123
                    ]
                }
            ]
        },
        "monthlyExpenses": {
            "amount": 54663,
            "labels": [
                "21 Ene - 28 Ene",
                "29 Ene - 05 Feb",
                "06 Feb - 13 Feb",
                "14 Feb - 21 Feb"
            ],
            "series": [
                {
                    "name": "Gastos",
                    "data": [
                        15521,
                        15519,
                        15522,
                        15521
                    ]
                }
            ]
        },
        "yearlyExpenses": {
            "amount": 648813,
            "labels": [
                "04 Dic - 11 Dic",
                "12 Dic - 19 Dic",
                "20 Dic - 27 Dic",
                "28 Dic - 04 Ene",
                "05 Ene - 12 Ene",
                "13 Ene - 20 Ene",
                "21 Ene - 28 Ene",
                "29 Ene - 05 Feb",
                "06 Ene - 13 Feb",
                "14 Ene - 21 Feb"
            ],
            "series": [
                {
                    "name": "Gastos",
                    "data": [
                        45891,
                        45801,
                        45834,
                        45843,
                        45800,
                        45900,
                        45814,
                        45856,
                        45910,
                        45849
                    ]
                }
            ]
        },
        "budgetDetails": {
            "columns": [
                "Tipo",
                "Total Presupuesto",
                "Gastos (EUR)",
                "Gastos (%)",
                "Restante (EUR)",
                "Restante (%)"
            ],
            "rows": [
                {
                    "type": "Conceptualización",
                    "total": 14880,
                    "expensesAmount": 14000,
                    "expensesPercentage": 94.08,
                    "remainingAmount": 880,
                    "remainingPercentage": 5.92
                },
                {
                    "type": "Diseño",
                    "total": 21080,
                    "expensesAmount": 17240.34,
                    "expensesPercentage": 81.78,
                    "remainingAmount": 3839.66,
                    "remainingPercentage": 18.22
                },
                {
                    "type": "Desarrollo",
                    "total": 34720,
                    "expensesAmount": 3518,
                    "expensesPercentage": 10.13,
                    "remainingAmount": 31202,
                    "remainingPercentage": 89.87
                },
                {
                    "type": "Extras",
                    "total": 18600,
                    "expensesAmount": 0,
                    "expensesPercentage": 0,
                    "remainingAmount": 18600,
                    "remainingPercentage": 100
                },
                {
                    "type": "Márketing",
                    "total": 34720,
                    "expensesAmount": 19859.84,
                    "expensesPercentage": 57.2,
                    "remainingAmount": 14860.16,
                    "remainingPercentage": 42.8
                }
            ]
        },
        "teamMembers": [
            {
                "id": "2bfa2be5-7688-48d5-b5ac-dc0d9ac97f14",
                "avatar": "assets/images/avatars/female-10.jpg",
                "name": "Nadia Mcknight",
                "email": "nadiamcknight@mail.com",
                "phone": "+1-943-511-2203",
                "title": "Project Director"
            },
            {
                "id": "77a4383b-b5a5-4943-bc46-04c3431d1566",
                "avatar": "assets/images/avatars/male-19.jpg",
                "name": "Best Blackburn",
                "email": "blackburn.best@beadzza.me",
                "phone": "+1-814-498-3701",
                "title": "Senior Developer"
            },
            {
                "id": "8bb0f597-673a-47ca-8c77-2f83219cb9af",
                "avatar": "assets/images/avatars/male-14.jpg",
                "name": "Duncan Carver",
                "email": "duncancarver@mail.info",
                "phone": "+1-968-547-2111",
                "title": "Senior Developer"
            },
            {
                "id": "c318e31f-1d74-49c5-8dae-2bc5805e2fdb",
                "avatar": "assets/images/avatars/male-01.jpg",
                "name": "Martin Richards",
                "email": "martinrichards@mail.biz",
                "phone": "+1-902-500-2668",
                "title": "Junior Developer"
            },
            {
                "id": "0a8bc517-631a-4a93-aacc-000fa2e8294c",
                "avatar": "assets/images/avatars/female-20.jpg",
                "name": "Candice Munoz",
                "email": "candicemunoz@mail.co.uk",
                "phone": "+1-838-562-2769",
                "title": "Lead Designer"
            },
            {
                "id": "a4c9945a-757b-40b0-8942-d20e0543cabd",
                "avatar": "assets/images/avatars/female-01.jpg",
                "name": "Vickie Mosley",
                "email": "vickiemosley@mail.net",
                "phone": "+1-939-555-3054",
                "title": "Designer"
            },
            {
                "id": "b8258ccf-48b5-46a2-9c95-e0bd7580c645",
                "avatar": "assets/images/avatars/female-02.jpg",
                "name": "Tina Harris",
                "email": "tinaharris@mail.ca",
                "phone": "+1-933-464-2431",
                "title": "Designer"
            },
            {
                "id": "f004ea79-98fc-436c-9ba5-6cfe32fe583d",
                "avatar": "assets/images/avatars/male-02.jpg",
                "name": "Holt Manning",
                "email": "holtmanning@mail.org",
                "phone": "+1-822-531-2600",
                "title": "Marketing Manager"
            },
            {
                "id": "8b69fe2d-d7cc-4a3d-983d-559173e37d37",
                "avatar": "assets/images/avatars/female-03.jpg",
                "name": "Misty Ramsey",
                "email": "mistyramsey@mail.us",
                "phone": "+1-990-457-2106",
                "title": "Consultant"
            }
        ]
    },
    produccion: {
        mesActual: format(new Date(), 'MMMM/yyyy', { locale: es })
    },
    semanasAnyo: null,
};

const inicioSlice = createSlice({
    name: 'produccionSeccion/inicio',
    initialState,
    reducers: {
        setMesActual: (state, action) => {
            state.produccion.mesActual = action.payload;
        },
        setSemanasAnyo: (state, action) => {
            state.semanasAnyo = action.payload;
        },
        setCambioPeriodo: (state, action) => {
            state.cambioPeriodo = action.payload;
        },
    },
    extraReducers: {
        [getNotesInicio.fulfilled]: (state, action) => {
            state.header.notesInicio = action.payload;
        },
        [getEventsInicio.fulfilled]: (state, action) => {
            state.header.eventsInicio = action.payload;
        },
        [getTasksInicio.fulfilled]: (state, action) => {
            state.header.tasksInicio = action.payload;
        },
        [getChatsInicio.fulfilled]: (state, action) => {
            state.menu.chatsPendientes = action.payload;
        },
    },
});

export const { 
    setMesActual, 
    setSemanasAnyo,
    setCambioPeriodo
 } = inicioSlice.actions;

export const selectDataInicioHeader = ({ produccionSeccion }) => produccionSeccion.inicio.header;
export const selectDataInicioWidgets = ({ produccionSeccion }) => produccionSeccion.inicio.widgets;
export const selectDataInicioMenu = ({ produccionSeccion }) => produccionSeccion.inicio.menu;
export const selectMesActual = ({ produccionSeccion }) => produccionSeccion.inicio.produccion.mesActual;
export const selectSemanasAnyo = ({ produccionSeccion }) => produccionSeccion.produccion.semanasAnyo;
export const selectCambioPeriodo = ({ produccionSeccion }) => produccionSeccion.produccion.cambioPeriodo;

export default inicioSlice.reducer;
