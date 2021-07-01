//we will be using jQuery

let defaultProperties = {      //default cell properties
    'text':"",
    'font-weight': "",
    'font-style':"",
    'text-decoration':"",
    'text-align':"left",
    'background-color': "white",
    'color': "black",
    'font-family': "Noto Sans",
    'font-size': 14
};

let cellData = {     /*this is to store the data in json format of each cell and we will
                     code it in such a way that it will display nothing if the cell has
                     all its default properties(i.e. default font-weight, font-style etc)
                     and will display the changed properties if any cell has any of these
                     properties changed */

    "Sheet1": {}     /*inside the sheet object, we wcellData[selectedSheet][rowId][colId][property] = value;ill have row-id and col-id objects
                     the design of sheet1 is :
                     Sheet1 : {

                         rowId {
                             colId{CellProperties}
                         }
                     }
                     */
};

let selectedSheet = "Sheet1";

$(document).ready(function () {

    //let cellContainer = $(".input-cell-container");

    for(let i=1; i<=100; i++)
    {
        let ans = ""; //this is the string for the column code of A, AB etc.
        let n=i;

        while(n>0)
        {
            let rem = n%26; //this is because of the 26 letters in the alphabet

            if(rem===0)
            {
                ans = "Z" + ans;
                n = Math.floor(n/26)-1;
            }

            else
            {
                ans = String.fromCharCode(rem-1+65) + ans; //ascii code of A is 65, B is 66 and so on...
                n = Math.floor(n/26);
            }
        }

        //appending column names for each of the 100 columns we have created in our for-loop
        let column = $(`<div class="column-name colId-${i}" id="colCode-${ans}">${ans}</div>`);
        $('.column-name-container').append(column);

        //appending row names now
        let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`)
        $('.row-name-container').append(row);
    }

    //doing for the input-cell (matrix traversal)
    for(let i=1; i<=100; i++)
    {
        let row = $(`<div class="cell-row"></div>`);

        for(let j=1; j<=100; j++)
        {
            let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
            let column = $(`<div class="input-cell" id="row-${i}-col-${j}" data="Code-${colCode}" contenteditable="true"></div>`);

            row.append(column);
        }

        $('.input-cell-container').append(row);
    }

    $('.align-icon').click(function () {
        $('.align-icon.selected').removeClass('selected');
        $(this).addClass('selected');
    });


    //toggle class means if there is no class attached to that particular element,
    //then add the class, if already class is applied, then remove it
    $('.style-icon').click(function () {
        $(this).toggleClass('selected');
    })

    $('.input-cell').click(function (e) {        //e is event listener

        if(e.ctrlKey) //this is the case for selecting multiple cells by pressing ctrl button on keyboard
        {
            let [rowId, colId] = getRowCol(this);

            //now for selecting multiple cells, we will check if top cell was selected or not
            //and if it was, we will simply remove the bottom border of the top cell

            if(rowId>1) {

                let topCellSelected = $(`#row-${rowId-1}-col-${colId}`).hasClass("selected"); //tells whether the cell top of the rowId cell is selected or not
                if (topCellSelected) {
                    $(this).addClass("top-cell-selected");
                    $(`#row-${rowId-1}-col-${colId}`).addClass("bottom-cell-selected");
                }
            }

            if(rowId<100) {

                let bottomCellSelected = $(`#row-${rowId+1}-col-${colId}`).hasClass("selected"); //tells whether the cell top of the rowId cell is selected or not
                if(bottomCellSelected)
                {
                    $(this).addClass("bottom-cell-selected");
                    $(`#row-${rowId+1}-col-${colId}`).addClass("top-cell-selected");
                }
            }

            if(colId>1) {

                let leftCellSelected = $(`#row-${rowId}-col-${colId-1}`).hasClass("selected"); //tells whether the cell top of the rowId cell is selected or not
                if(leftCellSelected)
                {
                    $(this).addClass("left-cell-selected");
                    $(`#row-${rowId}-col-${colId-1}`).addClass("right-cell-selected");
                }
            }

            if(colId<100) {

                let rightCellSelected = $(`#row-${rowId}-col-${colId+1}`).hasClass("selected"); //tells whether the cell top of the rowId cell is selected or not
                if(rightCellSelected)
                {
                    $(this).addClass("right-cell-selected");
                    $(`#row-${rowId}-col-${colId+1}`).addClass("left-cell-selected");
                }
            }
        }
        else //if the ctrl key is not pressed on the keyboard
        {
            $('.input-cell.selected').removeClass('selected');
        }

        $(this).addClass('selected'); //this has to be done everytime (obvio)
        changeHeader(this); //we will apply this function to 'this'
    });

    //change header function for changing the icons according to the cellProperties of selected cell
    function changeHeader(element)
    {
        let [rowId, colId] = getRowCol(element);

        let cellInfo = defaultProperties; //initializing them with the defaultProperties

        if(cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId])
            cellInfo = cellData[selectedSheet][rowId][colId];

        cellInfo['font-weight'] ? $('.icon-bold').addClass('selected') : $('.icon-bold').removeClass('selected');
        cellInfo['font-style'] ? $('.icon-italics').addClass('selected') : $('.icon-italics').removeClass('selected');
        cellInfo['text-decoration'] ? $('.icon-underline').addClass('selected') : $('.icon-underline').removeClass('selected');

        //now doing for the alignment icons
        let alignment = cellInfo['text-align']; //determines what is the current text-alignment currently

        //firstly just simply remove the selected class from the current align-icon
        $('.align-icon.selected').removeClass('selected');

        //and now apply that class to the icon which is justified
        $('.icon.align-' + alignment).addClass('selected');
    }

    $('.input-cell').dblclick(function () {
        $('.input-cell.selected').removeClass('selected');
        $(this).addClass('selected');
        $(this).attr('contentEditable', "true");
        $(this).focus();
    })

    //blur and focus are anti of each other
    //focus focuses on 'this' and blur removes the focus from the .selected element when some other cell is clicked
    $('.input-cell').blur(function () {
        $('.input-cell.selected').attr("contentEditable", "false");
    })

    $('.input-cell-container').scroll(function () {
        $('.column-name-container').scrollLeft(this.scrollLeft);
        $('.row-name-container').scrollTop(this.scrollTop);
    })
});

function getRowCol(element) { //this will tell the row and col id of our current cell

    let idArray = $(element).attr("id").split("-");
    let rowId = parseInt(idArray[1]);
    let colId = parseInt(idArray[3]);
    /*this is because when we execute the idArray line, we get "row-i-col-j"
    splitted into an array by "-", where :
    idArray[0] = row; idArray[1]=i(ith-row) idArray[2]=col idArray[3]=j(jth-col)
     */
    return [rowId, colId];
}

//defaultPossible is an argument which tells us that if we have cleared out any
// particular property(eg bold, italics, underline), it will tell us whether by
//deleting that property can we get all the default properties of a cell
function updateCell(property, value, defaultPossible)
{
    $('.input-cell.selected').each(function () { //for each loop for 'this'

        $(this).css(property, value);

        let [rowId, colId] = getRowCol(this);

        if(cellData[selectedSheet][rowId])  //i.e. if this row has any cell not equal to the default properties
        {
            if(cellData[selectedSheet][rowId][colId])
                cellData[selectedSheet][rowId][colId][property] = value;

            else
            {
                cellData[selectedSheet][rowId][colId] = {...defaultProperties}; //initialize them with the default properties first
                cellData[selectedSheet][rowId][colId][property] = value;
            }
        }

        else //if no row exists with the non-default property, then
        {
            cellData[selectedSheet][rowId] = {}; //create row first
            cellData[selectedSheet][rowId][colId] = {...defaultProperties};
            cellData[selectedSheet][rowId][colId][property] = value;
        }

        /*now we will check if the new properties of the .input-cell.selected
        is same as that of the defaultProperties or not */

        /*if the below written line is true, then we will delete the cellData as it is
        same to that of the DefaultProperties */
        if(defaultProperties && (JSON.stringify(cellData[selectedSheet][rowId][colId]) === JSON.stringify(defaultProperties)))
        {
            delete cellData[selectedSheet][rowId][colId];

            /*if the whole row has defaultProperties, then delete this row too as it
            will be redundant */
            if(Object.keys(cellData[selectedSheet][rowId]).length === 0)  //object.keys method in js to get the length of the object
                delete cellData[selectedSheet][rowId];
        }
    })
}

//bold for multiple cells
$('.icon-bold').click(function () {
    if($(this).hasClass('selected')) {
        updateCell("font-weight", "", true); //if bold is selected, assigning "" to value will make it un-bold i.e. remove the bold property
    }
    else {
        updateCell("font-weight", "bold", false);
    }
})

//italics for multiple cells
$('.icon-italics').click(function () {
    if($(this).hasClass('selected')) {
        updateCell("font-style", "", true); //if bold is selected, assigning "" to value will make it un-bold i.e. remove the bold property
    }
    else {
        updateCell("font-style", "italic", false);
    }
})

//underline for multiple cells
$('.icon-underline').click(function () {
    if($(this).hasClass('selected')) {
        updateCell("text-decoration", "", true); //if bold is selected, assigning "" to value will make it un-bold i.e. remove the bold property
    }
    else {
        updateCell("text-decoration", "underline", false);
    }
})

//icon-left-align
$('.icon-align-left').click(function () {

    if($(this).hasClass('selected'))
        updateCell('text-align', "", false);

    else
        updateCell("text-align", "left", true);
})

//icon-center-align
$('.icon-align-center').click(function () {

    if($(this).hasClass('selected'))
        updateCell('text-align', "", false);

    else
        updateCell("text-align", "center", true);
})

//icon-right-align
$('.icon-align-right').click(function () {

    if($(this).hasClass('selected'))
        updateCell("text-align", "", false);

    else
        updateCell("text-align", "right", true);
})



